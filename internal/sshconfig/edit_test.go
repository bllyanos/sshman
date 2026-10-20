package sshconfig

import (
	"errors"
	"strings"
	"testing"
)

func TestCreateInsertsBeforeCatchAll(t *testing.T) {
	d := Parse(readSample(t))
	if err := d.Create(Host{Alias: "new", HostName: "1.2.3.4", User: "me"}); err != nil {
		t.Fatal(err)
	}
	out := d.Render()
	want := "Host new\n    HostName 1.2.3.4\n    User me\n\nHost *\n"
	if !strings.Contains(out, want) {
		t.Errorf("new block not placed before Host *:\n%s", out)
	}
	if !strings.HasPrefix(out, "# managed by hand\nInclude") {
		t.Error("preamble changed")
	}
}

func TestCreateAppendsWithSeparator(t *testing.T) {
	d := Parse("Host a\n  User x")
	if err := d.Create(Host{Alias: "b", Port: "22"}); err != nil {
		t.Fatal(err)
	}
	if got, want := d.Render(), "Host a\n  User x\n\nHost b\n    Port 22\n"; got != want {
		t.Errorf("got %q want %q", got, want)
	}
	d = Parse("")
	_ = d.Create(Host{Alias: "only"})
	if got := d.Render(); got != "Host only\n" {
		t.Errorf("empty doc create: %q", got)
	}
}

func TestCreateRejectsDuplicateCaseInsensitive(t *testing.T) {
	d := Parse(readSample(t))
	if err := d.Create(Host{Alias: "GitHub.com"}); !errors.Is(err, ErrDuplicate) {
		t.Errorf("want ErrDuplicate, got %v", err)
	}
}

func TestUpdateRewritesOnlyThatBlock(t *testing.T) {
	in := readSample(t)
	d := Parse(in)
	h := d.Hosts()[2]
	h.User = "other"
	h.Options = append(h.Options, Option{"ForwardAgent", "no"})
	if err := d.Update("github.com", h); err != nil {
		t.Fatal(err)
	}
	out := d.Render()
	want := "Host github.com\n  HostName github.com\n  User other\n  IdentityFile \"~/.ssh/my key\"\n  IdentitiesOnly yes\n  ForwardAgent no\n\nMatch"
	if !strings.Contains(out, want) {
		t.Errorf("updated block wrong:\n%s", out)
	}
	before := in[:strings.Index(in, "Host github.com")]
	if !strings.HasPrefix(out, before) {
		t.Error("blocks before the edited one changed")
	}
}

func TestUpdateRename(t *testing.T) {
	d := Parse("Host a\n  User x\nHost b\n  User y\n")
	if err := d.Update("a", Host{Alias: "b"}); !errors.Is(err, ErrDuplicate) {
		t.Errorf("rename onto existing: %v", err)
	}
	if err := d.Update("a", Host{Alias: "c", User: "x"}); err != nil {
		t.Fatal(err)
	}
	if got := d.Render(); got != "Host c\n  User x\nHost b\n  User y\n" {
		t.Errorf("got %q", got)
	}
}

func TestReadOnlyAndMissing(t *testing.T) {
	d := Parse(readSample(t))
	if err := d.Delete("*"); !errors.Is(err, ErrReadOnly) {
		t.Errorf("delete *: %v", err)
	}
	if err := d.Update("work-db work-db-alt", Host{Alias: "x"}); !errors.Is(err, ErrReadOnly) {
		t.Errorf("update multi-pattern: %v", err)
	}
	if err := d.Delete("nope"); !errors.Is(err, ErrNotFound) {
		t.Errorf("delete missing: %v", err)
	}
}

func TestDelete(t *testing.T) {
	d := Parse("Host a\n  User x\n\nHost b\n  User y\n# about b\n\nHost c\n  User z\n")
	if err := d.Delete("b"); err != nil {
		t.Fatal(err)
	}
	if got, want := d.Render(), "Host a\n  User x\n\n# about b\nHost c\n  User z\n"; got != want {
		t.Errorf("got %q want %q", got, want)
	}
	if err := d.Delete("c"); err != nil {
		t.Fatal(err)
	}
	if got, want := d.Render(), "Host a\n  User x\n\n# about b\n"; got != want {
		t.Errorf("got %q want %q", got, want)
	}
}
