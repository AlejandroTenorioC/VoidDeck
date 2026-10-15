#!/bin/bash
# Instala Void Deck desde la carpeta de preparación del usuario deck y reinicia Decky.
# Se instala en /etc/voiddeck/deploy.sh (propiedad de root) y se ejecuta con sudo sin contraseña.
set -euo pipefail

SRC=/home/deck/.cache/voiddeck-deploy/VoidDeck
DST=/home/deck/homebrew/plugins/VoidDeck
PORT=1337

if [ ! -f "$SRC/plugin.json" ]; then
  echo "No hay paquete en $SRC" >&2
  exit 1
fi

port_busy() { ss -ltn "sport = :$PORT" | grep -q LISTEN; }

# Parada limpia. Si un plugin se cuelga al cerrar, Decky puede dejar procesos huérfanos con el
# puerto ocupado; al arrancar de nuevo fallaría en bucle y acumularía memoria hasta tumbar Steam.
systemctl stop plugin_loader
for _ in $(seq 1 15); do
  port_busy || break
  sleep 1
done
if port_busy || pgrep -f PluginLoader >/dev/null; then
  echo "Limpiando procesos huérfanos de Decky"
  pkill -9 -f PluginLoader || true
  sleep 1
fi
if port_busy; then
  echo "El puerto $PORT sigue ocupado; Decky no se arranca" >&2
  exit 1
fi

rm -rf "$DST"
cp -r "$SRC" "$DST"
systemctl start plugin_loader
echo "Void Deck instalado"
