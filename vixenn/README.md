# Vixenn 0.2 — Nexus

A Windows desktop browser with an original futuristic launch screen, consistent SVG icons, Chromium tabs, local bookmarks/history, downloads, and three accent themes.

## Run and build

Install Node.js 22.12+ from https://nodejs.org. Open PowerShell in this folder:

```powershell
npm ci
npm run check
npm start
npm run dist
```

The unsigned portable executable is written to `release/Vixenn-0.2.0-Windows.exe`.
The GitHub **Build Windows** workflow builds the same executable and uploads it
as the **Vixenn-Windows** artifact. See UPDATE.md for upload instructions.

## Built-in protection

Ghostery's filtering engine applies bundled EasyList and EasyPrivacy network
rules before matching requests are sent. The protection panel shows actual
blocked-request counts for this app session, filter versions, and errors.
No filter-server request is required at startup. There is no cosmetic filtering
or scriptlet injection in this version.

Public HTTP navigations are upgraded to HTTPS, with no automatic insecure
fallback. Localhost, 127.0.0.1, and ::1 stay available over HTTP. Invalid
certificates are rejected. Website renderers are sandboxed, isolated from Node,
and cannot access the app IPC bridge. Website and device permissions are denied.
Sec-GPC: 1 is sent to request Global Privacy Control; compliance varies by site.
Executable/script download filename extensions are blocked. Other downloads
use a save dialog and are never automatically opened.

These measures reduce risk; they do not guarantee safety. There is no phishing
reputation service, antivirus scanner, or automatic app/filter update mechanism.
Archives and files with other extensions may still be harmful. Filter matches
can miss ads or break website resources; video-ad blocking is not guaranteed.
Refresh the bundled snapshots from the URLs in filters/NOTICE.md and update
Electron regularly, test, and rebuild. Filter data keeps its original license.

## Shortcuts and data

Ctrl+L address, Ctrl+T new tab, Ctrl+W close tab, Ctrl+R reload, Ctrl+D bookmark,
Ctrl+Tab / Ctrl+Shift+Tab switch tabs, F11 fullscreen.

Bookmarks, preferences, and the latest 500 history entries are stored locally
in Electron's Vixenn user-data directory (normally under %APPDATA%). Website
cookies are persistent. Clearing history does not erase cookies. Download
history and blocking counts last for the current app session.

Chrome extensions, password management, sync, private mode, session restore,
and DRM integration are not implemented. Popup links open in new tabs, but
window.opener-dependent sign-in flows may not work. This is an early build;
use security-reviewed browsers for sensitive everyday browsing.
