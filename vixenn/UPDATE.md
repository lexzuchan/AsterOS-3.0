# Vixenn 0.2 — Nexus

## Upload this update

Extract Vixenn-0.2-source.zip. In BrowserTest, choose Add file → Upload files.
Drag all files and folders inside the extracted project into the upload area,
including `ui`, `tests`, `filters`, and `.github`. Commit to main. This replaces
the existing files and runs Build Windows. Download Vixenn-Windows from the
successful Actions run, extract it, and launch Vixenn-0.2.0-Windows.exe.

Upload the source ZIP contents, not the ZIP itself or its enclosing folder.
Do not upload node_modules or release.

## Changes

- Nexus home screen with an original animated orbital emblem, launch cards,
  redesigned search, and live tab and blocking counts.
- Original consistent SVG icons replace font-dependent toolbar symbols.
- Ghostery's network filtering engine uses bundled EasyList / EasyPrivacy.
  Blocking works offline from the first launch. Filter versions are shown in
  Protection. No browsing data is sent to a filtering service.
- Public HTTP navigation upgrades to HTTPS with no insecure fallback.
- Certificate validation, renderer sandboxing, context isolation, restrictive
  IPC, and denied website/device permissions remain enabled.
- Global Privacy Control request header is sent.
- Known executable/script download extensions are blocked.

## Limits

This is an early build, not a guarantee of safe browsing. There is no phishing
reputation service, malware scanning, or automatic update mechanism. Extension
blocking is a filename check; archives and other formats can contain harmful
content. Filters can miss ads, block useful resources, and leave empty ad spaces.
This release uses network rules, not cosmetic rules or scriptlets; no promise
is made that YouTube or other video ads will be blocked. All site permissions
are currently denied, which affects conferencing and location features.

Filter snapshots are bundled, not automatically refreshed. To update, download
the two original URLs listed in filters/NOTICE.md into their respective files,
run npm run check, then rebuild. Keep their headers and license notices.
Regular Electron updates are also required. Some websites do not support GPC.

## Develop

Use Node.js 22.12+ on Windows:

```powershell
npm ci
npm run check
npm start
npm run dist
```
