# Discover Quickly / vue-quickly

A Vue 3 + Vite application for exploring your Spotify library quickly with deep, contextual navigation between tracks, artists, albums, and recommendations. Includes an Express backend with Sequelize (PostgreSQL) for auth/token utilities.


# Important!
Spotify is planning to shut down most of the APIs that were used in this project.
- If you have an app created before November 27, 2024, you can still use this project.
- Since we don't know exactly when the APIs will shut down, this project may not work as expected
- [Spotify API changes announcement](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api)


## Features

- Your playlists, top tracks/artists, saved tracks/albums, followed artists, new releases, Spotify playlists, search
- Hover to listen, click to go deeper into track/artist/album details
- Parent-aware “deeper” navigation with replace/coexist rules per branch
- Seed-based recommendations for artists and tracks
- Mobile (separate implementation) and desktop views

## Tech Stack

- Frontend: Vue 3, Pinia, Vite
- Backend: Express, Sequelize, PostgreSQL
- API: Spotify Web API

## Prerequisites

- Node.js 18+ (recommended for Vite 6)
- npm 8+
- PostgreSQL (for backend if you use DB/migrations)
- Spotify app credentials and OAuth flow (the frontend expects cookies set by backend):
  - `access_token` – Spotify access token
  - `username` – Spotify username
  - `country` – optional country code used by API requests

## Setup

Install dependencies at the project root:

```bash
npm install
```

If you plan to use the backend and database, configure `backend/config/config.json` for your environment (PostgreSQL connection), then run migrations:

```bash
cd backend
npx sequelize-cli db:migrate
```

Generate a new migration (optional):

```bash
npx sequelize-cli migration:generate --name your-migration-name
```

## Run

Frontend (Vite):

```bash
vite
```

Build for production:

```bash
vite build
```

Backend (Express):

```bash
cd backend
node server.js
```

The backend serves API routes and simple token refresh utilities and expects the frontend at `http://localhost:5173` by default (adjust CORS if needed).

## Linting

```bash
npm run lint
```

## Deep Navigation Model (overview)

The UI renders “deeper” components keyed by type, id, and parent context: `type_id__p:PARENT_ID__`.

- Root → Root: a second root selection replaces the first root branch
- Root → Child → Child: selecting the same type under the same parent replaces its sibling
- Root → Child → Child → Child: different types can coexist within the same branch

The visibility manager registers DOM nodes by keys, shows/hides on demand, and clears pending visibility for not-yet-mounted nodes. The Pinia store (`useDeeperStore`) tracks sections, attaches `parentKey`, replaces items with the same `type`/`parentKey`, and can remove entire subtrees when replacing a branch.

## Project Structure: Composables, Mixins, Services, Stores, Utils

- Composables (`src/composables/`)
  - `useVisibilityManager.js`: Global registry for component refs and visibility by unique keys; supports pending requests and parent-aware keys like `__p:<id>__`.
  - `useMediaDisplay.js`: Computes background styles, preview availability, and display classes for media items.
  - `useFiltering.js`, `useSorting.js`, `useSelection.js`: Helpers for filtered/sorted lists and interactive selection state.
  - `README.md`: Detailed guide for the visibility system with examples.

- Mixins (`src/mixins/`)
  - `authMixin.js` → `isAuth()`: Checks `access_token` cookie; clears `queue` in localStorage if missing.
  - `detectingMobileMixin.js` → `isMobile()`: UA-based detection to toggle mobile/desktop UIs.
  - `prefMixin.js` → `preferred()`: Resolves theme from OS preference or `localStorage`.

- Services (`src/services/`)
  - `spotifyApi.js`: Wrapper for Spotify Web API (axios) with token refresh; provides endpoints like `getTopTracks`, `getArtist`, `getAlbum`, `getRecommendations`, follow/unfollow, and checks.

- Stores (`src/stores/`)
  - `deeper-store.js`: Core navigation and visibility coordination. Manages sections, caches (tracks/artists/albums/seeds), parent-aware keys, subtree removal, sibling replacement, and pending visibility clearing.
  - `spotify-store.js`: High-level Spotify data fetching for lists and reload actions.
  - `audio-store.js`: Handles audio preview hover/playback.
  - `queue-store.js`: Simple queue management (add/order).
  - `example-store.js`: Example scaffold.

- Utils (`src/utils/`)
  - `artistUtils.js`: Helpers for artist name formatting and presence checks; integrates with `src/common/lists.js` for "A, B & C" formatting.


| Tables                | Discover Quickly | Discover Mobily |
| --------------------- | :--------------: | --------------: |
| Your Playlists        |        ✓         |               ✓ |
| Your Top Tracks       |        ✓         |               ✓ |
| Your Top Artists      |        ✓         |               ✓ |
| Your Saved Tracks     |        ✓         |               ✓ |
| Your Saved Albums     |        ✓         |               ✓ |
| Your Followed Artists |        ✓         |               ✓ |
| New Releases          |        ✓         |               ✓ |
| Spotify Playlists     |        ✓         |               ✓ |
| Search                |        ✓         |               ✓ |
| Hover to listen       |        ✓         |               ✓ |
| Click to deeper       |        ✓         |               ✓ |
| Save                  |        ✓         |               ✓ |
| Open in Spotify       |        ✓         |               ✓ |
| Mobile version        |        ✗         |               ✓ |
| Charts                |        ✓         |               ✗ |
| Genres                |        ✓         | Will not be realized |
| Random Artist         |        ✓         | Will not be realized |
| Random Genre          |        ✓         | Will not be realized |

## Deployment (Heroku buildpacks example)

```text
https://github.com/timanovsky/subdir-heroku-buildpack
heroku/nodejs
```

## Icons

https://fontawesome.com/

## External Docs

https://getbootstrap.com/docs/5.3/getting-started/introduction/
