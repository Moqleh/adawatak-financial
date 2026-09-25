# Adawatak Financial | أدواتك المالية

Bilingual AR/EN financial calculators and market-reference platform built with Next.js 16, React 19 and TypeScript.

## Public V1

GitHub Pages: https://moqleh.github.io/adawatak-financial/

V1 is intentionally serverless/static. Financial calculators run in the browser, currency reference rates use Frankfurter, and Gold/Stock/Index pages act as a transparent reference hub with outbound links to external market sources instead of republishing unlicensed intraday values.

## Local development

```bash
npm ci
npm run dev
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs install, lint, typecheck, tests and build on pushes to `main`.

## Financial-data policy

- Market prices are never fabricated.
- Latest currency reference rates use Frankfurter v2 and display the source date.
- Currency rates are reference rates, not bank buy/sell or intraday trading quotes.
- Gold, Stock and Index V1 pages use clearly labeled external references rather than embedded unlicensed live/delayed quotes.
- If secret-backed market data is added after V1, keys must remain server-side and redistribution rights must be verified first.

## Privacy

No account is required in V1. Calculator values remain in the browser. Favorites are stored locally in localStorage.

See `STATUS.md`, `ROADMAP.md`, `BLOCKERS.md` and `CHANGELOG.md` for release state.
