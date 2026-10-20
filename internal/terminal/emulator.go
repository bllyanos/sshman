package terminal

// Emulator describes how to start one terminal emulator.
type Emulator struct {
	Name string `json:"name"`
	Bin  string `json:"bin"`
	// shell is the argv that opens a plain interactive window.
	shell []string
	// execFlag is placed between shell and the command to run;
	// empty means the command is appended directly.
	execFlag []string
	// sshClient replaces plain "ssh" for emulators with their own wrapper.
	sshClient []string
}

// Known lists supported emulators in default preference order.
var Known = []Emulator{
	{Name: "kitty", Bin: "kitty", sshClient: []string{"kitten", "ssh"}},
	{Name: "konsole", Bin: "konsole", execFlag: []string{"-e"}},
	{Name: "ghostty", Bin: "ghostty", execFlag: []string{"-e"}},
	{Name: "alacritty", Bin: "alacritty", execFlag: []string{"-e"}},
	{Name: "wezterm", Bin: "wezterm", shell: []string{"start"}, execFlag: []string{"--"}},
	{Name: "foot", Bin: "foot"},
	{Name: "ptyxis", Bin: "ptyxis", shell: []string{"--new-window"}, execFlag: []string{"--"}},
	{Name: "gnome-terminal", Bin: "gnome-terminal", execFlag: []string{"--"}},
	{Name: "xterm", Bin: "xterm", execFlag: []string{"-e"}},
}

// ShellArgs returns argv (without the binary) for an empty window.
func (e Emulator) ShellArgs() []string {
	return append([]string{}, e.shell...)
}

// SSHCommand is the argv that connects to a configured host alias.
// "--" stops the client from reading an alias that starts with "-" as an option.
func (e Emulator) SSHCommand(alias string) []string {
	client := e.sshClient
	if len(client) == 0 {
		client = []string{"ssh"}
	}
	return append(append([]string{}, client...), "--", alias)
}

// RunArgs returns argv (without the binary) that runs cmd in a new window.
func (e Emulator) RunArgs(cmd ...string) []string {
	args := e.ShellArgs()
	args = append(args, e.execFlag...)
	return append(args, cmd...)
}
