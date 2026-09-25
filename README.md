# Adawatak Financial | أدواتك المالية

Bilingual AR/EN financial calculators and market-information platform built with Next.js 16, React 19 and TypeScript.

## Public preview

GitHub Pages: https://moqleh.github.io/adawatak-financial/

GitHub Pages is used as the public static preview. Secret-backed market provider APIs require a server-capable production host.

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
- Gold, Stock and Index live/delayed quotes remain unavailable until an approved licensed provider is configured.
- Private provider keys must stay in server-side deployment secrets and are never committed.

## Privacy

No account is required in V1. Calculator values remain in the browser. Favorites are stored locally in localStorage.

See `STATUS.md`, `ROADMAP.md` and `BLOCKERS.md` for release state.
