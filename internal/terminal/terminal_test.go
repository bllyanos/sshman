package terminal

import (
	"errors"
	"os/exec"
	"reflect"
	"testing"
)

func fakeInstalled(t *testing.T, bins ...string) {
	t.Helper()
	orig := lookPath
	t.Cleanup(func() { lookPath = orig })
	lookPath = func(b string) (string, error) {
		for _, x := range bins {
			if x == b {
				return "/usr/bin/" + b, nil
			}
		}
		return "", exec.ErrNotFound
	}
}

func byName(n string) Emulator {
	for _, e := range Known {
		if e.Name == n {
			return e
		}
	}
	panic(n)
}

func TestSSHCommand(t *testing.T) {
	if got := byName("kitty").SSHCommand("box"); !reflect.DeepEqual(got, []string{"env", "TERM=xterm-256color", "kitten", "ssh", "--", "box"}) {
		t.Errorf("kitty: %v", got)
	}
	if got := byName("konsole").SSHCommand("box"); !reflect.DeepEqual(got, []string{"ssh", "--", "box"}) {
		t.Errorf("konsole: %v", got)
	}
}

func TestSSHClientIsACopy(t *testing.T) {
	kitty := byName("kitty")
	kitty.SSHClient()[0] = "mutated"
	if got := kitty.SSHClient(); !reflect.DeepEqual(got, []string{"kitten", "ssh"}) {
		t.Errorf("kitty: %v", got)
	}
}

func TestRunArgs(t *testing.T) {
	cases := map[string][]string{
		"kitty":          {"env", "TERM=xterm-256color", "kitten", "ssh", "--", "box"},
		"konsole":        {"-e", "ssh", "--", "box"},
		"wezterm":        {"start", "--", "ssh", "--", "box"},
		"gnome-terminal": {"--", "ssh", "--", "box"},
	}
	for n, want := range cases {
		e := byName(n)
		if got := e.RunArgs(e.SSHCommand("box")...); !reflect.DeepEqual(got, want) {
			t.Errorf("%s: got %v", n, got)
		}
	}
	if got := byName("wezterm").ShellArgs(); !reflect.DeepEqual(got, []string{"start"}) {
		t.Errorf("wezterm shell: %v", got)
	}
}

func TestResolve(t *testing.T) {
	fakeInstalled(t, "konsole", "xterm")
	t.Setenv("SSHMAN_TERMINAL", "")
	if e, _ := Resolve(""); e.Name != "konsole" {
		t.Errorf("default: %s", e.Name)
	}
	if e, _ := Resolve("xterm"); e.Name != "xterm" {
		t.Errorf("explicit: %s", e.Name)
	}
	if e, _ := Resolve("kitty"); e.Name != "konsole" {
		t.Errorf("missing explicit should fall back: %s", e.Name)
	}
	t.Setenv("SSHMAN_TERMINAL", "xterm")
	if e, _ := Resolve(""); e.Name != "xterm" {
		t.Errorf("env: %s", e.Name)
	}
}

func TestResolveNone(t *testing.T) {
	fakeInstalled(t)
	if _, err := Resolve(""); !errors.Is(err, ErrNoTerminal) {
		t.Errorf("got %v", err)
	}
}
