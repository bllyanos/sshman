package services

import (
	"path/filepath"
	"sync"

	"sshman/internal/sshconfig"
)

// HostService exposes ssh_config CRUD to the frontend. Every call reloads
// the file so edits made outside sshman are never overwritten blindly.
type HostService struct {
	store sshconfig.Store
	home  string
	mu    sync.Mutex
}

func NewHostService(store sshconfig.Store, home string) *HostService {
	return &HostService{store: store, home: home}
}

// ConfigPath is the file being managed.
func (s *HostService) ConfigPath() string { return s.store.Path }

// BackupPath is where the previous version is saved on every write.
func (s *HostService) BackupPath() string { return s.store.BackupPath() }

func (s *HostService) ListHosts() ([]sshconfig.Host, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	doc, err := s.store.Load()
	if err != nil {
		return nil, err
	}
	return doc.Hosts(), nil
}

func (s *HostService) CreateHost(h sshconfig.Host) error {
	return s.edit(func(d *sshconfig.Document) error { return d.Create(h) })
}

func (s *HostService) UpdateHost(alias string, h sshconfig.Host) error {
	return s.edit(func(d *sshconfig.Document) error { return d.Update(alias, h) })
}

func (s *HostService) DeleteHost(alias string) error {
	return s.edit(func(d *sshconfig.Document) error { return d.Delete(alias) })
}

// ListKeys suggests identity files for the host form.
func (s *HostService) ListKeys() ([]string, error) {
	return sshconfig.ListPrivateKeys(filepath.Dir(s.store.Path), s.home)
}

func (s *HostService) edit(apply func(*sshconfig.Document) error) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	doc, err := s.store.Load()
	if err != nil {
		return err
	}
	if err := apply(doc); err != nil {
		return err
	}
	return s.store.Save(doc)
}
