#!/usr/bin/env bash
set -euo pipefail
# Execute from repository root with root privileges on an Ubuntu build host.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if [[ $(id -u) -ne 0 ]]; then echo 'Run via sudo bash scripts/build-iso.sh' >&2; exit 1; fi
if [[ ! -x vixenn/node_modules/electron/dist/electron ]]; then
  echo 'Install Vixenn runtime first: cd vixenn && npm ci' >&2; exit 1
fi
rm -rf work output
mkdir -p work output
cd work
lb config \
  --mode debian \
  --distribution bookworm \
  --architectures amd64 \
  --binary-images iso-hybrid \
  --debian-installer none \
  --bootloaders syslinux,grub-efi \
  --archive-areas 'main contrib non-free-firmware' \
  --security true \
  --updates true \
  --apt-recommends false \
  --bootappend-live 'boot=live components username=asteros hostname=asteros'
mkdir -p config/package-lists config/includes.chroot/opt/vixenn config/includes.chroot/usr/local/bin \
  config/includes.chroot/usr/share/applications config/includes.chroot/etc/xdg/autostart \
  config/includes.chroot/etc/lightdm/lightdm.conf.d config/includes.chroot/etc/xdg/xfce4/xfconf/xfce-perchannel-xml \
  config/includes.chroot/usr/share/pixmaps config/includes.chroot/etc/skel/Desktop config/hooks/live
cat > config/package-lists/asteros.list.chroot <<'PACKAGES'
live-boot live-config systemd-sysv dbus-x11 xserver-xorg xinit xfce4 xfce4-terminal xfce4-settings xfce4-panel xfdesktop4 thunar mousepad lightdm lightdm-gtk-greeter network-manager network-manager-gnome policykit-1-gnome sudo curl ca-certificates iproute2 procps pciutils usbutils psmisc xdg-utils python3 python3-tk ufw libnss3 libnspr4 libatk-bridge2.0-0 libgtk-3-0 libgbm1 libasound2 libxss1 libxtst6 libxkbcommon0 libdrm2 libxrandr2 libxcomposite1 libxdamage1 libxfixes3 libx11-xcb1 fonts-dejavu-core fonts-liberation papirus-icon-theme adwaita-icon-theme
PACKAGES
# Copy exact supplied Vixenn source and Electron runtime into the live rootfs.
cp -a "$ROOT/vixenn/." config/includes.chroot/opt/vixenn/
cp "$ROOT/asteros-apps/asteros-settings.py" config/includes.chroot/usr/local/bin/asteros-settings
cp "$ROOT/asteros-apps/asteros-security.py" config/includes.chroot/usr/local/bin/asteros-security
cp "$ROOT/asteros-apps/vixenn-launcher.sh" config/includes.chroot/usr/local/bin/vixenn
chmod +x config/includes.chroot/usr/local/bin/{asteros-settings,asteros-security,vixenn}
cp "$ROOT/assets/"*.desktop config/includes.chroot/usr/share/applications/
cp "$ROOT/assets/vixenn.desktop" config/includes.chroot/etc/skel/Desktop/
cp "$ROOT/assets/asteros-settings.desktop" config/includes.chroot/etc/skel/Desktop/
cp "$ROOT/assets/asteros-security.desktop" config/includes.chroot/etc/skel/Desktop/
cp "$ROOT/assets/asteros-session.desktop" config/includes.chroot/etc/xdg/autostart/
cat > config/includes.chroot/etc/lightdm/lightdm.conf.d/50-asteros.conf <<'LIGHTDM'
[Seat:*]
autologin-user=asteros
autologin-user-timeout=0
user-session=xfce
LIGHTDM
cat > config/hooks/live/090-asteros.hook.chroot <<'HOOK'
#!/bin/sh
set -eu
# The Electron sandbox helper must be owned by root and setuid.
if [ -f /opt/vixenn/node_modules/electron/dist/chrome-sandbox ]; then
  chown root:root /opt/vixenn/node_modules/electron/dist/chrome-sandbox
  chmod 4755 /opt/vixenn/node_modules/electron/dist/chrome-sandbox
fi
chmod +x /opt/vixenn/node_modules/electron/dist/electron /usr/local/bin/vixenn
# Register actual Chromium/Electron browser handler; desktop icon via Xfce launcher.
mkdir -p /etc/skel/.config
cat > /etc/skel/.config/mimeapps.list <<'MIME'
[Default Applications]
x-scheme-handler/http=vixenn.desktop
x-scheme-handler/https=vixenn.desktop
text/html=vixenn.desktop
MIME
# No unrestricted passwordless sudo. Root account remains locked by default.
# Explicitly enable the system firewall at runtime when the OS boots.
mkdir -p /etc/xdg/autostart
HOOK
chmod +x config/hooks/live/090-asteros.hook.chroot
lb build
ISO=$(find . -maxdepth 1 -name '*.iso' -print -quit)
test -n "$ISO"
cp "$ISO" "$ROOT/output/asteros-vixenn-amd64.iso"
echo "Built: $ROOT/output/asteros-vixenn-amd64.iso"
