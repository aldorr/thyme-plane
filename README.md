# thyme plane

[![thyme plane](src/assets/logo.png)](https://github.com/aldorr/thyme-plane)

**thyme plane** is a PWA created with [Vue.js](https://vuejs.org/) 3, [Vite](https://vitejs.dev/), and [Buefy](https://buefy.org/) (Bulma 1) for making time entry and calculation easier. Adding clients, adding projects, and time for each project is simple. Then doing monthly calculations with filters by client and project makes creating reports a cinch.

[![Build Status](https://img.shields.io/badge/build-passing-passing?)](https://thyme.aldorr.net)
[![node](https://img.shields.io/badge/node-v20.19+-success?)](https://github.com/nodejs/node)
[![license](https://img.shields.io/badge/license-MIT-informational?)](https://github.com/aldorr/thyme-plane/blob/master/LICENSE)

## Requirements

- Node.js **20.19+** (see [`.tool-versions`](.tool-versions))

## Project setup

### Install dependencies

```bash
npm install
```

### Environment

Copy [`.env.sample`](.env.sample) to `.env` and fill in your Firebase project values (`VITE_FIREBASE_*`).

### Develop (Vite)

```bash
npm run dev
# or: npm run serve
```

### Production build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Deploy (Surge)

```bash
npm run deploy
```

This builds the app, copies `dist/index.html` to `dist/200.html` for SPA fallback, then publishes with Surge. Optionally add your domain to `/public/CNAME`.

---

### Try it with your own Firebase setup

1. Create a Firebase Realtime Database.
2. Apply security rules from [`firebase-rules.json`](firebase-rules.json) (or equivalent in the Firebase console).
3. Add an authorized Auth user and a matching `users/{uid}` record in the database.
4. Copy `.env.sample` → `.env` and set the `VITE_FIREBASE_*` variables.
5. Run `npm run dev`.

---

### Customize configuration

See the [Vite configuration reference](https://vitejs.dev/config/). App theme/colors live in [`src/assets/scss/main.scss`](src/assets/scss/main.scss).

## License

Code released under [MIT](LICENSE) license.

## Version

* Version 0.5.0

## Live demo

* [https://thyme.aldorr.net/](https://thyme.aldorr.net/)

## Communication

* notify about issues here
* or directly on discord: https://discord.gg/2U8EmG

## Donate

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H354CTG)
