# sshman

A small, neo-brutalist desktop app for managing `~/.ssh/config`.
Built with Wails v3 (Go + WebKitGTK), React, Tailwind CSS v4 and shadcn/ui.

## Features

- List, search (`/`), view, create (`Ctrl+N`), edit and delete `Host` entries
- Connect: opens `ssh <alias>` in an external terminal (kitty, konsole, ghostty,
  alacritty, wezterm, foot, ptyxis, gnome-terminal, xterm)
- Open a plain local terminal, copy the ssh command
- Safe writes: untouched lines are preserved byte-for-byte, the previous file is
  kept in `~/.ssh/config.bak`, and saves are atomic with the original permissions
- Pattern hosts (`Host *`, `Host a b`) and `Match` blocks are kept as-is and shown read-only

In the search box: `↑`/`↓` select, `Enter` connects, `Esc` clears.
Set `SSHMAN_TERMINAL=<name>` to force a terminal, or pick one in the status bar.

## Requirements (Fedora)

```sh
sudo dnf install gtk4-devel webkitgtk6.0-devel gcc pkgconf
go install github.com/wailsapp/wails/v3/cmd/wails3@latest
wails3 doctor
```

## Development

```sh
wails3 dev          # hot reload
wails3 build        # native binary in bin/sshman
go test ./...       # backend tests
cd frontend && npm test
```

## Layout

```
internal/sshconfig/   parse/render/edit ssh_config, file store, key listing
internal/terminal/    terminal emulator detection and launching
services/             Wails-bound HostService and TerminalService
frontend/src/lib/     pure helpers (filter, validation, ssh command)
frontend/src/hooks/   data hooks
frontend/src/components/  UI (components/ui = restyled shadcn)
```
