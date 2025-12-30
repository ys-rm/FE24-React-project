# Travel-APP

A minimal Next.js + TypeScript travel information app (App Router). Shows countries, region filters, country pages and simple weather/unsplash integrations.

## Overview
This project is a small travel information site built with Next.js (App Router) and TypeScript. It provides:
- A list of countries with search and region filters
- Country detail pages with images and weather
- Simple integrations with Unsplash, OpenWeather, and Wikipedia

## Run locally
Prerequisites: Node 18+ and `pnpm` installed.

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` in the project root with any API keys you want to use (optional). Example variables used by the project:

```
UNSPLASH_ACCESS_KEY=your_unsplash_key
OPENWEATHER_API_KEY=your_openweather_key
WIKIPEDIA_API_KEY=optional_wikipedia_key
```

3. Run development server:

```bash
pnpm dev
# Open http://localhost:3000
```

4. Build and preview production locally:

```bash
pnpm build
pnpm preview
```

## Data sources
- Countries list and metadata: typically from a local `lib/countries.ts` module or an external REST API (see `app/api/countries/route.ts`).
- Images: Unsplash via `lib/unsplash.ts` (requires `UNSPLASH_ACCESS_KEY`).
- Weather: OpenWeather (requires `OPENWEATHER_API_KEY`) via `lib/weather.ts`.
- Country information: Wikipedia via `lib/wikipedia.ts` (optional API key).

