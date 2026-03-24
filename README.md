# HCI full modular drop-in

This folder contains a drop-in modular split of the existing single-file app.

## Put these into your repo
- `src/App.jsx`
- `src/config/*`
- `src/lib/ai.js`
- `src/components/shared.jsx`
- `src/data/pages/*`
- `src/pages/*`
- `api/analyze.js`

## Notes
- The frontend AI call now goes to `/api/analyze`.
- The Anthropic key stays in Vercel as `ANTHROPIC_API_KEY`.
- The content-heavy `PAGES` object has been moved into individual files under `src/data/pages/`.
- The custom page components have been split into individual files under `src/pages/`.

## Caveat
This is a structural split of the current app. Because the original source is very large and hand-built, verify each page after upload.
