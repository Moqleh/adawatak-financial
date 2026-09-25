# Adawatak Financial | أدواتك المالية

Bilingual Arabic/English financial tools built with Next.js, React and TypeScript.

## Quality rules

- Financial calculators use tested calculation engines and decimal-safe money helpers.
- Market data must identify its source and update state.
- The UI must not describe fabricated or unverified values as live.
- Stale or unavailable market data is labeled explicitly.
- Arabic and English routes are generated separately.

## Development

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs linting, TypeScript checks, automated calculator tests and a production build. GitHub Pages deployment additionally verifies the static export.

## Market data

Currency reference rates currently use Frankfurter's public reference-rate API. Gold reference data uses XAUS in the client experience. Market indices are linked to authoritative/external references rather than republished as intraday values without a configured licensed provider.

The server-side market abstraction under `src/lib/market` is designed for provider adapters, cache/stale state and source metadata. Do not add hardcoded market prices.

## Hosting

The current public preview is deployed to GitHub Pages. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin when a custom domain is selected. GitHub Pages builds set `PAGES_BUILD=true` to enable the repository base path and static export.

## Disclaimer

Calculations and reference data are provided for general educational/informational purposes and are not financial, investment, tax, legal, or religious advice.
