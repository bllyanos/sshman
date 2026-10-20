package sshconfig

import (
	"os"
	"testing"
)

func readSample(t *testing.T) string {
	t.Helper()
	b, err := os.ReadFile("testdata/sample.config")
	if err != nil {
		t.Fatal(err)
	}
	return string(b)
}

func TestRoundTripIsLossless(t *testing.T) {
	for _, in := range []string{readSample(t), "", "\n", "Host a\n  User x", "# only comment\n"} {
		if got := Parse(in).Render(); got != in {
			t.Errorf("round trip mismatch\nwant %q\ngot  %q", in, got)
		}
	}
}

func TestParseHosts(t *testing.T) {
	hosts := Parse(readSample(t)).Hosts()
	if len(hosts) != 4 {
		t.Fatalf("want 4 hosts (Match excluded), got %d", len(hosts))
	}
	p := hosts[0]
	if p.Alias != "personal-vps" || p.HostName != "203.0.113.10" || p.User != "billy" ||
		p.Port != "2222" || p.IdentityFile != "~/.ssh/id_ed25519_personal" || p.ReadOnly {
		t.Errorf("unexpected host: %+v", p)
	}
	if len(p.Options) != 1 || p.Options[0] != (Option{"IdentitiesOnly", "yes"}) {
		t.Errorf("unexpected options: %+v", p.Options)
	}
	if w := hosts[1]; !w.ReadOnly || w.HostName != "10.0.0.5" {
		t.Errorf("multi-pattern host should be read-only with '=' parsed: %+v", w)
	}
	if g := hosts[2]; g.IdentityFile != "~/.ssh/my key" {
		t.Errorf("quoted identity file not unquoted: %q", g.IdentityFile)
	}
	if !hosts[3].ReadOnly {
		t.Error("Host * should be read-only")
	}
}

func TestFirstValueWins(t *testing.T) {
	h := Parse("Host a\n  User first\n  user second\n").Hosts()[0]
	if h.User != "first" {
		t.Errorf("want first, got %q", h.User)
	}
}
