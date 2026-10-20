package services

import (
	"os"
	"path/filepath"
	"testing"

	"sshman/internal/sshconfig"
)

func TestHostServiceCRUD(t *testing.T) {
	home := t.TempDir()
	path := filepath.Join(home, ".ssh", "config")
	svc := NewHostService(sshconfig.Store{Path: path}, home)

	if err := svc.CreateHost(sshconfig.Host{Alias: "a", HostName: "h"}); err != nil {
		t.Fatal(err)
	}
	if err := svc.UpdateHost("a", sshconfig.Host{Alias: "b", HostName: "h2"}); err != nil {
		t.Fatal(err)
	}
	hosts, err := svc.ListHosts()
	if err != nil || len(hosts) != 1 || hosts[0].Alias != "b" || hosts[0].HostName != "h2" {
		t.Fatalf("hosts=%+v err=%v", hosts, err)
	}
	if err := svc.CreateHost(sshconfig.Host{Alias: "b"}); err == nil {
		t.Error("duplicate accepted")
	}
	if err := svc.DeleteHost("b"); err != nil {
		t.Fatal(err)
	}
	if b, _ := os.ReadFile(path); len(b) != 0 {
		t.Errorf("file should be empty, got %q", b)
	}
}
