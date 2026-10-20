package terminal

import (
	"os"
	"os/exec"
	"syscall"
)

// Launcher starts emulators detached from sshman.
type Launcher struct {
	Dir string // working directory for new windows
}

// OpenShell opens an empty terminal window.
func (l Launcher) OpenShell(e Emulator) error {
	return l.start(e.Bin, e.ShellArgs())
}

// Run opens a terminal window running cmd.
func (l Launcher) Run(e Emulator, cmd ...string) error {
	return l.start(e.Bin, e.RunArgs(cmd...))
}

func (l Launcher) start(bin string, args []string) error {
	c := exec.Command(bin, args...)
	c.Dir = l.Dir
	c.Env = os.Environ()
	// own session so the terminal survives sshman closing
	c.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := c.Start(); err != nil {
		return err
	}
	go c.Wait() //nolint:errcheck // reap the child; its exit status is irrelevant
	return nil
}
