# STATUS

## Overall
Estimated completion: 82%

## Completed
- Public GitHub Pages preview with AR/EN routes.
- Next.js 16 / React 19 / TypeScript foundation.
- Decimal-based calculator core with CI-tested engines.
- Working UI: personal loan, mortgage, auto finance, credit card (fixed payment and target timeframe), compound savings, retirement/FIRE, inflation, percentage, discount, margin, markup, ROI, VAT add/extract, Gold/jewelry manual calculator, and Zakat calculator.
- Real tools directory and direct home-card links.
- MarketQuote/provider contracts, cache/stale semantics, status helpers and server quote boundary.
- Gold, currencies, converter, markets and exchange-aware stock routes.
- CI gates: npm ci, lint, typecheck, tests, build.

## Under Process
- Licensed live-data provider activation for Gold / FX / Stocks / Indices.
- Final visual browser QA across target breakpoints.
- SEO/accessibility/security/performance polish.

## Product decisions
- No fabricated market prices. Missing provider data is UNAVAILABLE.
- Stale data is explicitly marked and keeps its source timestamp.
- GitHub Pages is a static preview; server market APIs require a server-capable production host.
- No authentication/database is required for V1; favorites/preferences are local.
