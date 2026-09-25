# Adawatak Financial | أدواتك المالية

Bilingual AR/EN financial tools and market-information platform built with Next.js 16, React 19 and TypeScript.

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

CI runs all five gates on the main development branch and pull requests.

## Financial-data policy
Market prices are never fabricated. Provider-backed quotes must include source, provider timestamp and data status (LIVE, DELAYED, EOD, STALE or UNAVAILABLE). Secrets belong in deployment environment variables/GitHub Secrets and must never be committed.

## Deployment
The application is a standard Next.js deployment. Configure approved market-provider environment variables in the hosting platform, run `npm run build`, then perform a public smoke test before marking production Live. See STATUS.md, ROADMAP.md and BLOCKERS.md for current release state.
