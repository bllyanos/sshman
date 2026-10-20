package sshconfig

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func TestStoreSaveBacksUpAndKeepsMode(t *testing.T) {
	dir := t.TempDir()
	s := Store{Path: filepath.Join(dir, ".ssh", "config")}

	d, err := s.Load()
	if err != nil {
		t.Fatal(err)
	}
	_ = d.Create(Host{Alias: "a"})
	if err := s.Save(d); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(s.BackupPath()); !os.IsNotExist(err) {
		t.Error("no backup expected for a new file")
	}
	info, _ := os.Stat(s.Path)
	if info.Mode().Perm() != 0o600 {
		t.Errorf("mode %v", info.Mode().Perm())
	}

	d, _ = s.Load()
	_ = d.Create(Host{Alias: "b"})
	if err := s.Save(d); err != nil {
		t.Fatal(err)
	}
	bak, _ := os.ReadFile(s.BackupPath())
	if string(bak) != "Host a\n" {
		t.Errorf("backup %q", bak)
	}
	cur, _ := os.ReadFile(s.Path)
	if string(cur) != "Host a\n\nHost b\n" {
		t.Errorf("current %q", cur)
	}
}

func TestListPrivateKeys(t *testing.T) {
	home := t.TempDir()
	dir := filepath.Join(home, ".ssh")
	_ = os.MkdirAll(dir, 0o700)
	for _, f := range []string{"id_a", "id_a.pub", "id_b", "config", "known_hosts", "orphan.pub"} {
		_ = os.WriteFile(filepath.Join(dir, f), nil, 0o600)
	}
	got, err := ListPrivateKeys(dir, home)
	if err != nil {
		t.Fatal(err)
	}
	if want := []string{"~/.ssh/id_a"}; !reflect.DeepEqual(got, want) {
		t.Errorf("got %v", got)
	}
}
