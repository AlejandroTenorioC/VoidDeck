#!/bin/bash
# Install Void Deck from the deck user's staging directory and restart Decky.
# Installed at /etc/voiddeck/deploy.sh (owned by root) and run with password-free sudo.
set -euo pipefail

SRC=/home/deck/.cache/voiddeck-deploy/VoidDeck
DST=/home/deck/homebrew/plugins/VoidDeck
PORT=1337

if [ ! -f "$SRC/plugin.json" ]; then
  echo "No package at $SRC" >&2
  exit 1
fi

port_busy() { ss -ltn "sport = :$PORT" | grep -q LISTEN; }

# Clean stop. If a plugin hangs on shutdown, Decky can leave orphan processes holding the
# port; restarting would fail in a loop and consume memory until Steam crashes.
systemctl stop plugin_loader
for _ in $(seq 1 15); do
  port_busy || break
  sleep 1
done
if port_busy || pgrep -f PluginLoader >/dev/null; then
  echo "Cleaning up orphan Decky processes"
  pkill -9 -f PluginLoader || true
  sleep 1
fi
if port_busy; then
  echo "Port $PORT is still in use; Decky will not start" >&2
  exit 1
fi

rm -rf "$DST"
cp -r "$SRC" "$DST"
systemctl start plugin_loader
echo "Void Deck installed"
