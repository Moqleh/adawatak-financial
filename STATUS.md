# STATUS

## Overall
Estimated completion: 94%

## Completed
- Public GitHub Pages preview with Arabic and English routes.
- Next.js 16 / React 19 / TypeScript foundation.
- Decimal-based, tested calculator engines.
- Working calculator UI: personal loan, mortgage, auto finance, credit card (fixed payment and target timeframe), compound savings, retirement/FIRE, inflation, percentage, discount, margin, markup, ROI, VAT add/extract, Gold/jewelry manual calculator, and Zakat calculator.
- Advanced inputs for auto finance, compound savings and retirement assumptions.
- Real tools directory, direct home links, local favorites, guides, About, Privacy and Disclaimer pages.
- Latest daily reference FX rates and currency conversion through Frankfurter with explicit source/date disclosure.
- MarketQuote/provider contracts, cache/stale semantics, source/status helpers and server quote boundary for future market provider integration.
- Gold, currencies, converter, markets and exchange-aware stock routes.
- SEO metadata, sitemap and robots.
- GitHub Actions CI gates: npm ci, lint, typecheck, tests, build.
- Dedicated GitHub Pages workflow; duplicate Pages workflow removed.

## Remaining external blocker
- Live/delayed Gold, Stocks and Indices require an approved market-data provider, valid credentials, and redistribution rights. GitHub Pages cannot securely host private provider secrets or server-side proxy logic.

## Product decisions
- No fabricated market prices.
- Stale data must be explicitly marked with its original source timestamp.
- Currency values are daily reference rates, not bank buy/sell or intraday trading quotes.
- No authentication/database is required for V1; favorites/preferences are local to the browser.
- GitHub Pages is the public static preview. A server-capable host is required for secret-backed live market APIs.
