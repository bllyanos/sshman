#!/usr/bin/env bash
# Build sshman and install the binary into ~/.local/bin (override with BIN_DIR).
set -euo pipefail

cd "$(dirname "$0")"

BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"

wails3 build
mkdir -p "$BIN_DIR"
install -m 755 bin/sshman "$BIN_DIR/sshman"

echo "installed $BIN_DIR/sshman"
