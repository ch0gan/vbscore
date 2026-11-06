# vbscore
this web app is a javascript/css learning experiment
value is that I've never found an ios app with the ability to switch between rally and sideout scoring

Key features:
- side out scoring (used in beach and grass)
   - in both rally and side out scoring the score and name of the serving team is underlined
   - underline helps tracking when game has side out over and over again - let's face it sometimes you forget who served the last play
- switches between portrait and landscape mode based on screen size (on mobile will resize on rotate)
- allows switching sides to you match actual side switching on court
- pop out menu
- team name changes
- persistant variable memory survives browser reload
- installs on your phone as an app and works offline (see below)

## Install as a phone app (Progressive Web App)

The site is a Progressive Web App (PWA), so you can install it on your home screen. It opens full screen with no browser bar and works without an internet connection, which helps in gyms with bad Wi-Fi.

- **iPhone (Safari):** open the site, tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** open the site, tap **⋮**, then **Install app**.

The site must be served over HTTPS for phones to offer the install option.

### PWA files

| File | What it does |
| --- | --- |
| `manifest.json` | Gives the app its name ("SideOut"), icons, and colors. Tells the phone to open it full screen, in portrait or landscape. |
| `sw.js` | The service worker. It saves the app's files on the phone (including the Font Awesome icon) so the app works offline. |
| `icons/` | App icons: `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` (180×180, for iPhone). To change the icon, replace these files with the same names and sizes. |
| `index.html` | The `<head>` links the manifest and icons and has iPhone home-screen tags. A short script at the bottom starts the service worker. |

### Updating the app

When you push changes, installed apps open the saved copy first and download the new files in the background. The update shows up the **second** time the app is opened.

If you add a new file the app needs (for example, a new `.js` or image), add it to the `APP_FILES` list in `sw.js`. To force every phone to throw away its old copy, change `CACHE_NAME` in `sw.js` (for example, `vbscore-v1` to `vbscore-v2`).

### Testing locally

Service workers only run when the site is served over `http://localhost` or HTTPS. They don't run when you open `index.html` straight from a file. To test, serve the folder with a local web server, such as the VS Code Live Server extension or `npx serve`.

Thank you SHogan2 for adding all these features!
