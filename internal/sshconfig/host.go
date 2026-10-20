package sshconfig

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

// Option is an ssh_config directive the form does not model explicitly.
type Option struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// Host is the editable view of a single "Host <alias>" block.
type Host struct {
	Alias        string   `json:"alias"`
	HostName     string   `json:"hostName"`
	User         string   `json:"user"`
	Port         string   `json:"port"`
	IdentityFile string   `json:"identityFile"`
	Options      []Option `json:"options"`
	// ReadOnly marks blocks sshman lists but refuses to edit
	// (wildcards or multiple patterns on one Host line).
	ReadOnly bool `json:"readOnly"`
}

var ErrInvalidHost = errors.New("invalid host")

// Validate checks the fields sshman writes back to the config file.
func (h Host) Validate() error {
	if h.Alias == "" {
		return fmt.Errorf("%w: alias is required", ErrInvalidHost)
	}
	if isPattern(h.Alias) {
		return fmt.Errorf("%w: alias must not contain whitespace or wildcards", ErrInvalidHost)
	}
	for name, v := range map[string]string{"hostname": h.HostName, "user": h.User, "port": h.Port} {
		if hasSpace(v) {
			return fmt.Errorf("%w: %s must not contain whitespace", ErrInvalidHost, name)
		}
	}
	if h.Port != "" {
		if p, err := strconv.Atoi(h.Port); err != nil || p < 1 || p > 65535 {
			return fmt.Errorf("%w: port must be between 1 and 65535", ErrInvalidHost)
		}
	}
	for _, o := range h.Options {
		if o.Key == "" || hasSpace(o.Key) || strings.Contains(o.Key, "=") {
			return fmt.Errorf("%w: option key %q is invalid", ErrInvalidHost, o.Key)
		}
		if isModeledKey(o.Key) || strings.EqualFold(o.Key, "Host") || strings.EqualFold(o.Key, "Match") {
			return fmt.Errorf("%w: option %q must use its dedicated field", ErrInvalidHost, o.Key)
		}
		if strings.ContainsAny(o.Value, "\r\n") {
			return fmt.Errorf("%w: option %q value must be a single line", ErrInvalidHost, o.Key)
		}
	}
	if strings.ContainsAny(h.IdentityFile, "\r\n\"") {
		return fmt.Errorf("%w: identity file path is invalid", ErrInvalidHost)
	}
	return nil
}

func hasSpace(s string) bool { return strings.ContainsAny(s, " \t\r\n") }

// isPattern reports whether a Host value can't be addressed as a single alias.
func isPattern(s string) bool { return hasSpace(s) || strings.ContainsAny(s, "*?!,") }
