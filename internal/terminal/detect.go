package terminal

import (
	"errors"
	"os"
	"os/exec"
)

var ErrNoTerminal = errors.New("no supported terminal emulator found")

// lookPath is swapped in tests.
var lookPath = exec.LookPath

// Available returns installed emulators in preference order.
func Available() []Emulator {
	var out []Emulator
	for _, e := range Known {
		if _, err := lookPath(e.Bin); err == nil {
			out = append(out, e)
		}
	}
	return out
}

// Resolve picks the emulator by name, then $SSHMAN_TERMINAL, then the
// first installed one.
func Resolve(name string) (Emulator, error) {
	avail := Available()
	for _, want := range []string{name, os.Getenv("SSHMAN_TERMINAL")} {
		if want == "" {
			continue
		}
		for _, e := range avail {
			if e.Name == want {
				return e, nil
			}
		}
	}
	if len(avail) == 0 {
		return Emulator{}, ErrNoTerminal
	}
	return avail[0], nil
}
