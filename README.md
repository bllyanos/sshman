# sshman

A small, neo-brutalist Linux desktop app for managing `~/.ssh/config`.
Built with Wails v3 (Go + WebKitGTK), React, Tailwind CSS v4 and shadcn/ui.
It ships as a single native binary; there is no separate backend server.

## Features

- List, search, view, create, edit and delete `Host` entries
- Connect in an external terminal: kitty, konsole, ghostty, alacritty, wezterm,
  foot, ptyxis, gnome-terminal or xterm
  - kitty connects with `kitten ssh` and `TERM=xterm-256color`, so remote hosts
    without kitty's terminfo still get proper colors
- Open a plain local terminal, copy the ssh command for the selected terminal
- Right-click a host for Connect / Copy / Edit / Delete; double-click connects
- Safe writes: untouched lines (comments, `Include`, odd spacing, `=` syntax)
  are preserved byte-for-byte, the previous file is kept in `~/.ssh/config.bak`,
  and saves are atomic with the original file permissions
- Pattern hosts (`Host *`, `Host a b`) are shown read-only; `Match` blocks are
  kept as-is and hidden

## Usage

| Key | Action |
| --- | --- |
| `/` | Focus search |
| `Ctrl+N` | New host |
| `↑` / `↓` (in search) | Select previous / next host |
| `Enter` (in search) | Connect to the selected host |
| `Esc` (in search) | Clear search |

Pick a terminal in the status bar (remembered between runs), or set
`SSHMAN_TERMINAL=<name>` to change the default. Without either, the first
installed terminal from the list above is used.

## Requirements

Linux (Wayland or X11). On Fedora:

```sh
sudo dnf install gtk4-devel webkitgtk6.0-devel gcc pkgconf
go install github.com/wailsapp/wails/v3/cmd/wails3@latest
wails3 doctor
```

Go and Node versions are pinned in `mise.toml` (Go 1.27, Node 20).

## Development

```sh
wails3 dev                              # run with hot reload
wails3 build                            # native binary in bin/sshman
go test ./internal/... ./services/...   # backend tests
cd frontend && npm test                 # frontend tests
```

After changing a Go service signature, regenerate the frontend bindings:

```sh
wails3 generate bindings -clean=true -ts -i
```

## Layout

```
internal/sshconfig/       parse/render/edit ssh_config, file store, key listing
internal/terminal/        terminal emulator detection and launching
services/                 Wails-bound HostService and TerminalService
frontend/src/lib/         pure helpers (filter, validation, ssh command)
frontend/src/hooks/       data hooks
frontend/src/components/  UI (components/ui = restyled shadcn)
```

## License

[MIT](LICENSE)
