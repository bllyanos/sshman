package services

import (
	"errors"

	"sshman/internal/terminal"
)

// TerminalService opens external terminal windows.
type TerminalService struct {
	launcher terminal.Launcher
}

func NewTerminalService(launcher terminal.Launcher) *TerminalService {
	return &TerminalService{launcher: launcher}
}

// AvailableTerminals lists installed emulators, preferred first.
func (s *TerminalService) AvailableTerminals() []string {
	names := []string{}
	for _, e := range terminal.Available() {
		names = append(names, e.Name)
	}
	return names
}

// Connect runs `ssh <alias>` in a new window and returns the emulator used.
// An empty preferred name picks the default emulator.
func (s *TerminalService) Connect(alias, preferred string) (string, error) {
	if alias == "" {
		return "", errors.New("alias is required")
	}
	e, err := terminal.Resolve(preferred)
	if err != nil {
		return "", err
	}
	return e.Name, s.launcher.Run(e, terminal.SSHCommand(alias)...)
}

// OpenTerminal opens a plain local shell window.
func (s *TerminalService) OpenTerminal(preferred string) (string, error) {
	e, err := terminal.Resolve(preferred)
	if err != nil {
		return "", err
	}
	return e.Name, s.launcher.OpenShell(e)
}
