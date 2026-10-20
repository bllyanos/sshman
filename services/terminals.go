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

// Connect runs the emulator's ssh client (e.g. `kitten ssh` in kitty) in a new window and returns the emulator used.
// An empty preferred name picks the default emulator.
func (s *TerminalService) Connect(alias, preferred string) (string, error) {
	if alias == "" {
		return "", errors.New("alias is required")
	}
	e, err := terminal.Resolve(preferred)
	if err != nil {
		return "", err
	}
	return e.Name, s.launcher.Run(e, e.SSHCommand(alias)...)
}

// SSHClient returns the ssh client argv prefix the emulator connects with (e.g. ["kitten", "ssh"]),
// so the UI shows the same command Connect runs. Falls back to plain ssh when no emulator resolves.
func (s *TerminalService) SSHClient(preferred string) []string {
	e, err := terminal.Resolve(preferred)
	if err != nil {
		return []string{"ssh"}
	}
	return e.SSHClient()
}

// OpenTerminal opens a plain local shell window.
func (s *TerminalService) OpenTerminal(preferred string) (string, error) {
	e, err := terminal.Resolve(preferred)
	if err != nil {
		return "", err
	}
	return e.Name, s.launcher.OpenShell(e)
}
