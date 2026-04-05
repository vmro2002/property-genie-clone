# Property Genie Clone

A demo real estate listings platform, featuring server-side rendering, AI-powered search, and a full filter system.

---

## Index

1. [Live Link](#live-link)
2. [Live Demo](#live-demo)
3. [How to Run](#how-to-run)
4. [Features](#features)
5. [Tests](#tests)
6. [Project Structure](#project-structure)
7. [Tech Stack](#tech-stack)

---

## Live Link

https://property-genie-clone.vercel.app/

---

## How to Run

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### AI Feature Prerequisite

The AI search feature requires an OpenAI API key. After copying `.env.example`, open `.env` and set:

```
OPENAI_API_KEY=your-key-here
```

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm test` | Run Jest unit and integration tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:all` | Run both Jest and Playwright in sequence |
| `npm run lint` | Run ESLint |

---

## Features

### Search with AI

A floating "Search with AI" button sits in the bottom-right corner of the page. Clicking it opens a modal where the user describes the property they are looking for in plain language. The description is sent to `/api/ai-generate`, which calls the OpenAI API using structured output constrained by a Zod schema. The API returns a parsed set of search parameters, and the user is immediately redirected to the matching filtered listings page.

### Server-Side Rendering

The listings page is rendered on the server using `getServerSideProps`. SSR was chosen over client-side fetching for several reasons:

- **SEO** — The listing page is fully-rendered server-side, making listings discoverable by search engine crawlers.
- **URL-driven state** — All filter, sort, search, and pagination state lives in URL query params. Each unique URL maps to a deterministic, server-rendered response, making pages inherently shareable and bookmarkable.
- **CDN caching** — Responses include `Cache-Control: s-maxage=60, stale-while-revalidate=300` headers, allowing a CDN to serve repeated queries instantly without hitting the origin server.

### Property Search and Filters

Users can sort listings by price (low to high, high to low) or by date (oldest, newest). The filter modal supports:

- Minimum and maximum price
- Property category (Residential, Condo, Flat, Room)
- Property type (Apartment, Condo, Flat, Room)
- Number of bedrooms (Studio through 5+)
- Number of bathrooms (1 through 5+)
- Furnishing status (Unfurnished, Partially Furnished, Fully Furnished)

All active filters are encoded in the URL, keeping results shareable.

### Search by Name and Location

A search bar at the top of the page supports full-text search by property name. As the user types, a debounced query is sent to `/api/locations`, which returns matching states and cities. Clicking a suggestion navigates to listings filtered by that location.

### Save and Manage Filters

Users can save the current URL state (filters, search, location) as a named search. Saved searches are persisted in `localStorage` and are accessible via a "Saved" modal. Each saved search can be applied with one click to restore the full filter state, or deleted individually.

### Pagination

Page-based pagination was chosen over infinite scroll because:

- Each page has a unique, shareable URL.
- Search engines can index every results page.
- Users can navigate directly to a specific page or share a link to it.

### Responsive Design

Layouts adapt across screen sizes using MUI's responsive `sx` prop and breakpoint system, from single-column mobile layouts to multi-column desktop views.

### Error Handling

- Custom `404` and `500` pages provide a consistent experience for navigation and server errors.
- API routes return structured `{ error: string }` JSON with appropriate HTTP status codes (400, 405, 422, 500).
- Client-side API errors (e.g. from the AI search mutation) are surfaced inline in the UI via MUI `Alert` components.

---

## Tests

Tests are split across two layers, kept in separate directories because they use different runners, environments, and requirements.

### Unit and Integration Tests — Jest + React Testing Library

Location: `src/__tests__/`

Covers:

- **Pure utility functions** — edge cases for query param parsing, price formatting, filter summary generation, and stable serialisation.
- **Zod schemas** — valid and invalid inputs, boundary conditions, and exact error paths.
- **API route handlers** — handlers are imported directly and called with mock `req`/`res` objects; `fetch` is replaced with `jest-fetch-mock`.
- **Custom hooks** — rendered with `renderHook`, using `next-router-mock` for the router and `jest-fetch-mock` for network calls.
- **Components** — conditional rendering states (loading, error, empty, populated) and user interaction callbacks.

```bash
npm test
```

### End-to-End Tests — Playwright

Location: `e2e/`

Covers the full user flows against a running Next.js server, with external APIs mocked via `page.route`:

- Search by keyword and location autocomplete.
- Filter apply, validation error, and clear flows.
- Save, apply, and delete saved filter flows.

```bash
npm run test:e2e
```

---

## Project Structure

```
src/
├── components/          # UI components (no logic, no data fetching)
│   ├── AiSearch/        # AI search floating button and modal
│   ├── FilterModal/     # Filter dialog and toggle chips
│   ├── ListingCard/     # Property card and stat items
│   ├── SavedFiltersModal/
│   └── SearchBar/       # Search input and location dropdown
├── hooks/               # All client-side logic (no JSX)
│   ├── useAiGeneration.ts
│   ├── useFilterForm.ts
│   ├── useFilterSave.ts
│   ├── useListingsSort.ts
│   ├── usePropertySelector.ts
│   ├── useSearchForm.ts
│   └── useSearchLocationsQuery.ts
├── pages/
│   ├── api/
│   │   ├── ai-generate.ts   # POST — OpenAI structured output
│   │   └── locations.ts     # GET  — location autocomplete proxy
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx            # Listings page (SSR)
│   ├── 404.tsx
│   └── 500.tsx
├── schemas/             # Zod schemas
│   ├── aiDescriptionSchema.ts
│   ├── aiGenerationSchema.ts
│   ├── filterSchema.ts
│   └── searchSchema.ts
└── utils/               # Pure functions, types, interfaces, constants
e2e/                     # Playwright end-to-end tests
src/__tests__/           # Jest unit and integration tests
```

---

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| Language | TypeScript |
| UI library | MUI v7 + styled-components |
| Server state | TanStack Query v5 |
| Forms | react-hook-form + Zod |
| AI | OpenAI SDK (structured output) |
| Unit / integration tests | Jest + React Testing Library |
| End-to-end tests | Playwright |
