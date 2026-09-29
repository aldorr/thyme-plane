# thyme plane

[![thyme plane](src/assets/thyme-plane-logo.svg)](https://github.com/aldorr/thyme-plane)

**thyme plane** is a time-tracking web app built with [Vue.js](https://vuejs.org/) 3, [Vite](https://vitejs.dev/), [Buefy](https://buefy.org/) 3 (Bulma 1), and [Firebase](https://firebase.google.com/) (Authentication + Realtime Database).

Add clients, areas, and jobs, log time entries, then filter and total hours for reporting.

[![Build Status](https://img.shields.io/badge/build-passing-passing?)](https://thyme.aldorr.net)
[![node](https://img.shields.io/badge/node-v20.19+-success?)](https://github.com/nodejs/node)
[![version](https://img.shields.io/badge/version-2.0.0-informational?)](https://github.com/aldorr/thyme-plane)
[![license](https://img.shields.io/badge/license-MIT-informational?)](https://github.com/aldorr/thyme-plane/blob/master/LICENSE)

## Stack (v2)

| Piece       | Details                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| UI          | Vue 3 + Vue Router 4 + Vuex 4                                                                                                              |
| Components  | Buefy 3 on Bulma 1                                                                                                                         |
| Theme       | [Catppuccin Mocha](https://catppuccin.com/palette/) (dark by default) via Sass in [`src/assets/scss/main.scss`](src/assets/scss/main.scss) |
| Auth / data | Firebase Auth (email/password) + Realtime Database                                                                                         |
| Build       | Vite 8                                                                                                                                     |
| Icons       | Font Awesome (vue-fontawesome)                                                                                                             |
| Validation  | VeeValidate 4                                                                                                                              |

## Requirements

- Node.js **20.19+** (see [`.tool-versions`](.tool-versions))
- A Firebase project with **Authentication** (Email/Password) and **Realtime Database**

## Quick start

```bash
git clone https://github.com/aldorr/thyme-plane.git
cd thyme-plane
npm install
cp .env.sample .env
# edit .env with your Firebase web app config (see below)
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Environment variables

Copy [`.env.sample`](.env.sample) to `.env` and set values from the Firebase console → **Project settings** → **Your apps** → Web app config:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

`VITE_FIREBASE_MEASUREMENT_ID` is optional (Analytics). All other `VITE_FIREBASE_*` keys are required for the app to start.

Vite only exposes variables prefixed with `VITE_` to the client. Never commit a filled `.env` (it is gitignored).

## Firebase setup

### 1. Create the project

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. Add a **Web** app and copy its config into `.env`.
3. Enable **Authentication** → **Sign-in method** → **Email/Password**.
4. Create a **Realtime Database** (start in locked mode; you will paste rules next).

### 2. Security rules

Apply the rules in [`firebase-rules.json`](firebase-rules.json) in the Realtime Database **Rules** tab (or via the Firebase CLI).

Important behavior:

- Signed-in users can only use the DB if a matching `users/{uid}` record exists.
- Clients/areas/jobs live under `customerentries`.
- Time entries live under `users/{uid}/timeentries`.

### 3. Bootstrap the first user

Because rules require `users/{uid}` to exist, create the first account carefully:

**Option A — Auth console + manual DB node (recommended for first user)**

1. Authentication → **Users** → **Add user** (email + password).
2. Copy that user’s **UID**.
3. In Realtime Database, create:

```json
{
  "users": {
    "<UID>": {
      "fullname": "Your Name",
      "username": "yourname",
      "email": "you@example.com"
    }
  }
}
```

4. Sign in through the app with that email/password.

**Option B — Temporary open rules**

1. Temporarily allow authenticated writes to `users` only long enough to create the first account via the in-app **Add user** control (after someone can sign in), then restore [`firebase-rules.json`](firebase-rules.json).

After the first user exists, additional users can be created from the app (nav **user-plus**), which writes both Auth and `users/{uid}`.

### 4. Optional demo data

[`thyme-demo-export.json`](thyme-demo-export.json) is a sample Realtime Database export (clients/areas/jobs and sample users/entries). Import it in the Firebase console (**Realtime Database** → ⋮ → **Import JSON**) only on an empty/dev project, then adjust or remove sample users so UIDs match your Auth users.

## Scripts

| Command                         | Purpose                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev` / `npm run serve` | Local Vite dev server                                                        |
| `npm run build`                 | Production build → `dist/`                                                   |
| `npm run preview`               | Serve the production build locally                                           |
| `npm run lint`                  | ESLint (`.js` / `.vue`)                                                      |
| `npm run deploy`                | Build + publish with [Surge](https://surge.sh/) via [`deploy.sh`](deploy.sh) |

## Deploy

### Vercel

1. Import the GitHub repo in Vercel.
2. Framework preset: **Vite** (or set Build Command `npm run build`, Output Directory `dist`).
3. Add the same `VITE_FIREBASE_*` variables under **Project → Settings → Environment Variables**.
4. Redeploy after changing env vars (they are baked in at build time).

Vite may warn that the main JS chunk is larger than 600 kB (Firebase + Buefy + Font Awesome). That is expected and does not fail the deploy.

### Surge

```bash
npm run deploy
```

This builds the app, copies `dist/index.html` to `dist/200.html` for SPA fallback, then runs `surge ./dist`.

## Theming

Dark **Catppuccin Mocha** is forced with `data-theme="dark"` on [`index.html`](index.html). Brand and surface colors are defined in [`src/assets/scss/main.scss`](src/assets/scss/main.scss) using Bulma/Buefy [Sass variables](https://buefy.org/documentation/sass).

The wordmark used in the nav and start screen is [`src/assets/thyme-plane-logo.svg`](src/assets/thyme-plane-logo.svg).

## Project layout (high level)

```
src/
  assets/scss/main.scss   # Mocha theme + Bulma/Buefy
  components/             # Nav, auth modals, DurationPicker, …
  views/                  # Home/login, About, Entry, List, Jobs, Admin
  store.js                # Vuex + Firebase Auth/RTDB
  firebase.js             # Config from VITE_* env
  router.js               # Routes (lazy-loaded views)
```

## License

Code released under the [MIT](LICENSE) license.

## Version

- **2.0.0** — Vue 3, Vite, Buefy 3 / Bulma 1, Catppuccin Mocha, custom DurationPicker

## Live demo

- [https://thyme.aldorr.net/](https://thyme.aldorr.net/)

## Communication

- Open an issue on this repository
- Discord: https://discord.gg/jGkwFnp76

## Donate

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H354CTG)
