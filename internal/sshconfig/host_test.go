package sshconfig

import (
	"errors"
	"testing"
)

func TestValidate(t *testing.T) {
	cases := []struct {
		name string
		h    Host
		ok   bool
	}{
		{"minimal", Host{Alias: "a"}, true},
		{"full", Host{Alias: "a", HostName: "h", User: "u", Port: "22", IdentityFile: "~/.ssh/my key"}, true},
		{"empty alias", Host{}, false},
		{"wildcard alias", Host{Alias: "a*"}, false},
		{"spaced alias", Host{Alias: "a b"}, false},
		{"bad port", Host{Alias: "a", Port: "70000"}, false},
		{"non numeric port", Host{Alias: "a", Port: "ssh"}, false},
		{"spaced user", Host{Alias: "a", User: "u v"}, false},
		{"modeled option", Host{Alias: "a", Options: []Option{{"hostname", "x"}}}, false},
		{"multiline option", Host{Alias: "a", Options: []Option{{"ProxyJump", "x\nHost evil"}}}, false},
		{"empty option key", Host{Alias: "a", Options: []Option{{"", "x"}}}, false},
	}
	for _, c := range cases {
		err := c.h.Validate()
		if c.ok != (err == nil) {
			t.Errorf("%s: ok=%v err=%v", c.name, c.ok, err)
		}
		if err != nil && !errors.Is(err, ErrInvalidHost) {
			t.Errorf("%s: error not wrapped: %v", c.name, err)
		}
	}
}
