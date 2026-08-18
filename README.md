# Araw-Araw na Gabay FINAL

A complete installable PWA for a 365-day Filipino devotional.

## Included
- 365 curated KJV references
- Filipino daily reflection
- 365 generated prayer entries
- Daily practical action
- Date navigation and calendar
- Previous / Next day
- Saved devotionals
- Reading progress and streak
- Search
- Horoscope by zodiac and date
- 30 local nature backgrounds
- PWA manifest and service worker
- Local caching for offline use after content has been viewed
- KJV text fetched from DailyBible.ca and cached on the device

## GitHub upload
Replace your existing:
- index.html
- app.js
- style.css
- sw.js
- manifest.json
- data/content.json

Upload/replace:
- assets/backgrounds/
- icons/

Then commit the changes. Vercel should redeploy automatically.

## Important Bible note
The King James Version is a historic English translation first published in 1611. It is not the original first-century manuscripts. The app uses KJV text for the daily Scripture display.

## Offline note
The app bundles its interface, data, icons, and backgrounds. KJV verse text is fetched from the API and cached after it is viewed. A verse that has never been loaded while online may not have its full text available offline.

## Horoscope note
Horoscope content is for reflection and entertainment, not guaranteed prediction.


## FINAL 1.1 background fix
Backgrounds now use explicit relative `./assets/backgrounds/` paths, are preloaded before display, have a local fallback, and use a new service-worker cache version so the old cached background path is removed after deployment.
