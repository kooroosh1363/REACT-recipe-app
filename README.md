# PantryPilot — Recipe Discovery Workspace

PantryPilot modernizes the original 2023 React recipe experiment into a complete, testable front-end workspace for discovering and saving recipes.

The maintained public repository no longer depends on the broken gitlink/submodule that previously pointed at a separate private repository.

## What changed

The original project had several portfolio-blocking issues:

- the public repository contained a broken `recipe-app` gitlink instead of actual source code
- a plaintext API key was committed in `text.txt`
- the real React source lived in a separate private repository
- the app still rendered a temporary `salam` heading
- the popular-recipes component nested the same `.map()` twice
- loading, error, empty, cancellation, and persistence states were missing
- the codebase was based on Create React App
- no CI or meaningful automated tests were present

PantryPilot fixes those issues while preserving the original recipe-discovery idea.

## Product capabilities

- local demo catalog that works with no external service
- recipe and ingredient search
- category filters
- sort by featured, cooking time, or title
- saved-only view
- favorites persisted in `localStorage`
- recipe detail dialog
- loading, empty, and error states
- keyboard-accessible controls
- Escape-to-close detail view
- reduced-motion support
- responsive desktop/mobile layout
- optional Spoonacular development adapter

## Architecture

```text
src/data/recipes.js
        │
        ├── demo catalog
        │
        ▼
src/services/recipe-service.js
        │
        ├── demo mode
        └── optional live adapter
        │
        ▼
src/lib/recipe-utils.js
src/lib/favorites.js
        │
        ▼
RecipeControls
RecipeCard
RecipeDetail
        │
        ▼
App.jsx
```

Filtering, sorting, API mapping, and favorite persistence are kept outside the UI components so they can be tested independently.

## Demo-first data strategy

The deployed portfolio version intentionally works without an API key.

This avoids a broken public demo when an external quota, credential, or API is unavailable.

For local development only, you may create:

```bash
cp .env.example .env
```

Then add your own Spoonacular key:

```text
VITE_SPOONACULAR_API_KEY=your_own_key
```

### Important security note

Vite variables prefixed with `VITE_` are embedded in browser code. They are **not secrets**.

Do not use this pattern for credentials that must remain private. A production system should call Spoonacular through a backend/API proxy and store the key server-side.

No real key is committed in the maintained version.

## Previously exposed credential

The original public repository committed a Spoonacular API key in `text.txt`.

Deleting that file from the current branch does **not** erase it from Git history. The old key should be considered exposed and must be revoked/rotated in the Spoonacular dashboard.

## Local development

Requirements:

- Node.js 20+

Install and run:

```bash
npm install
npm run dev
```

Vite will print the local URL, normally:

```text
http://localhost:5173
```

## Tests

```bash
npm test
```

Coverage includes:

- query normalization
- title/tag/ingredient filtering
- category filtering
- saved-only filtering
- non-mutating sorting
- accessible result-count text
- live API model mapping
- malformed localStorage recovery
- favorite deduplication/toggling
- end-to-end search interaction
- saved recipe filtering
- recipe detail open/close flow

## Production build

```bash
npm run build
```

Vite outputs the optimized site to `dist/`.

## CI

Every pull request and push to `main` runs:

```text
npm install
   ↓
Vitest
   ↓
Vite production build
```

## GitHub Pages

The repository includes a manual Pages workflow.

Enable it once at:

**Settings → Pages → Source → GitHub Actions**

Then run:

**Actions → Deploy Pages → Run workflow**

The Pages build uses the repository-relative base path automatically.

## Scope boundaries

PantryPilot is intentionally a front-end portfolio application.

It does not claim to provide:

- user accounts
- cloud-synced favorites
- nutrition or medical advice
- grocery checkout
- production secret management
- a proprietary recipe database

## License

MIT.
