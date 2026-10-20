package sshconfig

import "strings"

const (
	keyHostName     = "HostName"
	keyUser         = "User"
	keyPort         = "Port"
	keyIdentityFile = "IdentityFile"
)

var modeledKeys = []string{keyHostName, keyUser, keyPort, keyIdentityFile}

func isModeledKey(k string) bool {
	for _, m := range modeledKeys {
		if strings.EqualFold(k, m) {
			return true
		}
	}
	return false
}

// splitDirective splits "Key value", "Key=value" or "Key = value".
// ok is false for blank lines and comments.
func splitDirective(line string) (key, value string, ok bool) {
	s := strings.TrimSpace(line)
	if s == "" || strings.HasPrefix(s, "#") {
		return "", "", false
	}
	i := strings.IndexAny(s, " \t=")
	if i < 0 {
		return s, "", true
	}
	key = s[:i]
	rest := strings.TrimLeft(s[i:], " \t")
	if strings.HasPrefix(rest, "=") {
		rest = strings.TrimLeft(rest[1:], " \t")
	}
	return key, rest, true
}

func unquote(v string) string {
	if len(v) >= 2 && v[0] == '"' && v[len(v)-1] == '"' {
		return v[1 : len(v)-1]
	}
	return v
}

func quoteIfNeeded(v string) string {
	if hasSpace(v) {
		return `"` + v + `"`
	}
	return v
}
