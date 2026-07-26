# 📝 Posts hub

A React + TypeScript app that browses, searches, and creates posts against the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API. Built as a skills assessment.

## 🚀 Running locally

```bash
git clone https://github.com/lahav97/react-posts-app.git
cd react-posts-app
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To build and preview a production bundle:

```bash
npm run build
npm run preview
```

## 🛠️ Tech stack

| | |
|---|---|
| Language | TypeScript 5, strict mode |
| Framework | React 18 |
| Build tool | Vite |
| Node | 20.x (built and tested on v20.19.0) |
| Routing | React Router v6 (`createBrowserRouter`) |
| Server state | TanStack Query |
| HTTP client | Axios |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Linting | ESLint |

### Why TanStack Query over a hand-rolled Context

Fetching posts, a single post, and its comments each needs its own loading / error / data state. Doing that with `useState` + `useEffect` + Context means writing and wiring that lifecycle by hand for every request. TanStack Query gives it declaratively — `useQuery` returns `data`, `isLoading`, `isError`, and a typed `error`, plus caching, deduplication, and retries, without any of it being hand-written. The only piece of state this app actually owns manually is the search input.

## 📜 Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite |

## 🏗️ Project structure

```
src/
├── api/          # Plain async functions that call JSONPlaceholder (no React)
├── hooks/        # TanStack Query hooks wrapping the api layer
├── lib/          # Query client config, query key definitions
├── types/        # Shared TypeScript interfaces
├── components/
│   ├── ui/         # Generic, reusable primitives (Spinner, ErrorState, EmptyState)
│   ├── posts/       # Post-specific presentational components
│   └── comments/    # Comment-specific presentational components
├── pages/        # One file per route; the only components that call hooks
├── App.tsx       # Shared shell (header + router outlet)
├── router.tsx    # Route definitions
└── main.tsx      # Entry point — providers + router
```

The layering is deliberate: `api` never imports React, `components` never fetch their own data, and `pages` are the only layer that connects the two. This keeps presentational components trivially testable and reusable.

## ✨ Features

- **Browse posts** — responsive card grid (1 → 4 columns depending on viewport), fetched from `/posts`
- **Search** — client-side, filters the already-fetched list by title as you type, with a live result count and a clear button
- **Post detail** — full post content plus its comments, fetched in parallel
- **Add a post** — form with validation, posts to `/posts`
- **Loading, error, and empty states** throughout — every fetch has all three handled explicitly, with retry where it makes sense
- **Responsive** — checked on mobile (iPhone Safari) and desktop
- **Accessible** — semantic HTML, keyboard focus and activation (Tab / Enter) on cards and forms, `aria-live` search feedback, screen-reader-friendly loading/error regions

**Typical flow:** land on the list, search narrows it instantly with no network calls, click a card for the full post and its comments, or use *Add post* to create one — new posts appear at the top of the list immediately and survive a page refresh.

## 🧩 A design decision worth explaining: the fake API problem

JSONPlaceholder doesn't persist writes. `POST /posts` always returns a fake `id: 101` and nothing is actually saved server-side. Left unhandled, this means: newly created posts vanish on refresh, and creating more than one post produces duplicate React keys (since every response reuses `id: 101`).

This app works around it deliberately:

- On successful creation, a real unique id is generated client-side (a negative number, so it can never collide with JSONPlaceholder's real ids 1–100)
- The new post is injected directly into the TanStack Query cache for an instant UI update, and mirrored to `localStorage` so it survives a page refresh
- On load, locally-created posts are merged back in alongside the fetched server posts
- The post detail page checks the cache and `localStorage` before falling back to the network, so a locally-created post's detail page works correctly even on a direct refresh

## ⚠️ Known limitations

- Locally-created posts don't have real comments (the server never received them), so their detail page shows "no comments yet" rather than attempting a request that can't succeed.
- `userId` on created posts is a hardcoded constant, since JSONPlaceholder has no authentication — in a real backend this would come from the session, not the client.
- Search is client-side, per the assignment's requirement — appropriate here since the full dataset (100 posts) is small and already fetched; wouldn't scale to a much larger, server-held dataset without server-side search.