# AsterOS — Vixenn Edition (experimental)

**A Windows-inspired desktop experience powered by Debian Linux, Xfce and the REAL Vixenn Electron/Chromium browser.**

This is a **new Linux-based AsterOS edition**, not a continuation of the bare-metal 32-bit AsterOS 0.2 kernel. There is no practicable way to run Electron/Chromium directly on the existing small hobby kernel. The Linux kernel makes the browser, real networking, device drivers, process isolation and a usable desktop possible while allowing a custom AsterOS UI on top.

## Included

- Xfce graphical desktop, taskbar, application menu, window management, File Manager and Terminal
- Vixenn 0.2 *original source* vendored into `vixenn/` (Electron 43 and bundled filter lists)
- Vixenn registered as the default HTTP/HTTPS browser; launchers on desktop and in application menu
- AsterOS Settings: working GTK theme switching and shortcuts to actual Xfce settings panels
- AsterOS Security Center: **read-only real status checks** for UFW, network management, kernel, ports, root account. **NOT** an antivirus or Microsoft Defender clone
- Debian live system with an ephemeral session (changes vanish on reboot unless persistence is configured separately)
- GitHub Actions workflow to build an amd64 hybrid ISO from source; downloadable artifact

**Warning:** Desktop and apps have been assembled but a full ISO boot was **not** tested. The ISO workflow requires internet access and may need changes for future Debian/Electron versions.

## Build on GitHub (recommended)

1. Create a *new repository* for this edition, e.g. `AsterOS-Vixenn` (do not overwrite your original bare-metal branch).
2. Unzip this package; upload **all contents** into the repository root, preserving `.github/workflows/build-iso.yml` and the `vixenn` folder.
3. Open **Actions → Build AsterOS Vixenn Edition ISO → Run workflow**.
4. Download the **AsterOS-Vixenn-ISO** artifact. Extract `asteros-vixenn-amd64.iso`.
5. Test with QEMU or VirtualBox as a bootable ISO (64-bit CPU, 4 GB RAM recommended, 2 GB minimum, 8+ GB free disk for building). Legacy BIOS is the safest first attempt.

**Do not rely on virtual-machine.pages.dev for this release.** It uses a much heavier modern 64-bit Linux userspace than your old text-mode hobby OS; browser emulators may be too slow or unsupported. QEMU or VirtualBox are the preferred test environments.

## Local Linux build

On Ubuntu 24.04 amd64:

```bash
sudo apt update
sudo apt install -y live-build debootstrap xorriso squashfs-tools mtools dosfstools
# Install Node.js 22 from an official supported source.
cd vixenn
npm ci
npm run check
cd ..
sudo bash scripts/build-iso.sh
```

The output is `output/asteros-vixenn-amd64.iso`.

## Quick QEMU launch

```bash
qemu-system-x86_64 -m 4096 -smp 2 -cdrom output/asteros-vixenn-amd64.iso -boot d -vga std
```

## Project tree

```text
.github/workflows/build-iso.yml   Automated ISO build
scripts/build-iso.sh            Debian live-build configuration and packaging
vixenn/                         Actual user-provided Vixenn source, including filters
asteros-apps/vixenn-launcher.sh  Electron browser launcher (sandbox enabled)
asteros-apps/asteros-settings.py Working Xfce customization interface
asteros-apps/asteros-security.py Read-only real system security checks
assets/*.desktop                Desktop, default-browser and menu shortcuts
```

## Browser and security limitations

- Vixenn is Electron-based with Chromium; its version is pinned by Vixenn's `package-lock.json`. Keep Electron and Debian patched.
- Vixenn protections are those implemented in the original project. Its ad blocking is **not** antivirus or a replacement for a security-reviewed browser.
- There is no Windows binary compatibility or Windows Defender. Windows `.exe` programs do not run in this environment without additional compatibility work.
- NetworkManager needs a working virtual NIC; HTTPS requires correct time and certificates.
- UFW is installed but **not claimed to be enabled**; inspect its real status in Security Center. Security Center does not make false assurances or require arbitrary root access.
- This ISO uses a live user session and autologin for convenience and is **not hardened for production or sensitive browsing**.
- Filter list licenses remain in `vixenn/filters/`; original Vixenn files stay with their own licensing and notices.
- Browser data and files do not survive reboot by default; no persistence installer is shipped yet.

## Test checklist after boot

1. Xfce login happens automatically and desktop appears.
2. Double-click **Vixenn Browser**. Verify its Chromium pages load on a live network.
3. Open **AsterOS Settings** and switch between dark and light themes.
4. Open **AsterOS Security Center**; check **actual** firewall and network status.
5. Open a link from terminal with `xdg-open https://example.com` and verify Vixenn handles it.

If GitHub Actions fails, share the first failing step's expanded logs. If the ISO boots to a black screen, try a standard VirtualBox VM with VMSVGA graphics and enough RAM, or use QEMU as above.
