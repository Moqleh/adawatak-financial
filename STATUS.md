# STATUS

## Overall
Estimated completion: 99% — V1 feature scope complete; awaiting CI and GitHub Pages verification for the final release commit.

## V1 scope completed
- Public GitHub Pages application with Arabic and English routes.
- Next.js 16 / React 19 / TypeScript foundation.
- Decimal-based, tested calculator engines and complete calculator UI set.
- Local favorites, guides, About, Privacy and Disclaimer pages.
- Daily reference FX rates and conversion through Frankfurter with source/date disclosure.
- Gold, Stocks and Indices converted to a reference-hub model for V1: no fabricated or unlicensed intraday values; trusted external source links are shown instead.
- Gold/jewelry manual calculator remains fully available for user-entered reference prices.
- SEO metadata, sitemap, robots and GitHub Actions quality/deployment pipeline.

## V1 release rule
V1 is considered complete without embedded intraday Gold/Stock/Index quotes. Those are an optional future enhancement that requires a licensed data provider and a secret-capable backend/serverless proxy.

## Product decisions
- No fabricated market prices.
- External market references are explicitly labeled and open in a separate tab.
- Currency values are daily reference rates, not bank buy/sell or intraday trading quotes.
- No authentication/database is required for V1; favorites/preferences are browser-local.
- GitHub Pages remains the zero-server-cost V1 host.
