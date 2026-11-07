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
- match history with set-by-set line scores (see below)

## Match history

The app saves the final score of each set and groups sets into matches.

1. When a set ends, tap the **Set** button in the top-right corner (it shows the current set, such as "Set 2") and choose **End Set**. You can also tap **End Set** in the ☰ menu. A box shows the match box score, including the set that just ended.
2. Choose what happens next:
   - **Next set:** saves the set, resets the score to 0–0, and moves to the next set.
   - **End match:** saves the set and finishes the match.
   - **Cancel:** closes the box without saving.
3. To see past matches, tap the **Set** button and choose **History**, or tap **History** in the ☰ menu. Each match shows as a box score: one row per team, one column per set, with each set winner in bold and the match winner's row in bold. Tap ✖ or outside the box to close it.

A set can't be saved with a tied score. A match also finishes on its own when you change a team name, or when you open the app on a later day. To remove a match, tap **Delete** next to it on the History page.

History is stored in `localStorage` on the phone (key `vbscore_history`). It doesn't sync between devices, and deleting the home screen app deletes its history.

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

If you add a new file the app needs (for example, a new `.js` or image), add it to the `APP_FILES` list in `sw.js`.

### Version number

The bottom of the ☰ menu shows the version, such as `Version 2026.11.06-2156` (year.month.day-hourminute). Use it to check which version a phone is running.

The version lives in `version.js`. A Git hook (`.githooks/pre-commit`) rewrites it with the current date and time on every commit, including commits made in GitHub Desktop. The service worker names its cache after the version, so each new version makes phones save a fresh copy and delete the old one.

The hook only runs after you turn it on, once for each copy of the repo:

```
git config core.hooksPath .githooks
```

Commits made on the GitHub website don't run the hook, so they keep the previous version number.

### Testing locally

Service workers only run when the site is served over `http://localhost` or HTTPS. They don't run when you open `index.html` straight from a file. To test, serve the folder with a local web server, such as the VS Code Live Server extension or `npx serve`.

Thank you SHogan2 for adding all these features!
