#!/bin/sh
set -eu
cd /opt/vixenn
# Electron sandbox remains ON. Never launch the browser as root.
if [ "$(id -u)" -eq 0 ]; then
  echo 'Vixenn must not run as root.' >&2
  exit 1
fi
exec /opt/vixenn/node_modules/electron/dist/electron /opt/vixenn "$@"
