package sshconfig

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
)

// Store loads and saves one ssh_config file on disk.
type Store struct {
	Path string
}

// DefaultPath is ~/.ssh/config.
func DefaultPath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".ssh", "config"), nil
}

// BackupPath is where the previous version is kept before every save.
func (s Store) BackupPath() string { return s.Path + ".bak" }

// Load returns an empty document when the file does not exist yet.
func (s Store) Load() (*Document, error) {
	b, err := os.ReadFile(s.Path)
	if errors.Is(err, fs.ErrNotExist) {
		return Parse(""), nil
	}
	if err != nil {
		return nil, err
	}
	return Parse(string(b)), nil
}

// Save backs up the current file, then atomically replaces it.
func (s Store) Save(d *Document) error {
	if err := os.MkdirAll(filepath.Dir(s.Path), 0o700); err != nil {
		return err
	}
	mode := fs.FileMode(0o600)
	if old, err := os.ReadFile(s.Path); err == nil {
		if info, err := os.Stat(s.Path); err == nil {
			mode = info.Mode().Perm()
		}
		if err := os.WriteFile(s.BackupPath(), old, 0o600); err != nil {
			return err
		}
	} else if !errors.Is(err, fs.ErrNotExist) {
		return err
	}
	return writeAtomic(s.Path, []byte(d.Render()), mode)
}

func writeAtomic(path string, data []byte, mode fs.FileMode) error {
	tmp, err := os.CreateTemp(filepath.Dir(path), ".config-*.tmp")
	if err != nil {
		return err
	}
	defer os.Remove(tmp.Name())
	if _, err := tmp.Write(data); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Chmod(mode); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Sync(); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Close(); err != nil {
		return err
	}
	return os.Rename(tmp.Name(), path)
}
