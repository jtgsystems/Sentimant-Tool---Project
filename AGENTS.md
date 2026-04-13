# AGENTS.md

## Repo Snapshot
- Repository: `jtgsystems/Sentimant-Tool---Project`
- Default branch: `master`
- Visibility: `public`
- Summary: Sentiment analysis tool - Analyze text emotions and opinions using advanced NLP
- Detected stack: Node.js

## Read First
- `README.md`
- `CLAUDE.md`
- `package.json`
- `.github/workflows/`

## Key Paths
- `app/`
- `lib/`
- `components/`
- `hooks/`
- `public/`
- `styles/`

## Working Rules
- Keep changes focused on the task and match the existing file layout and naming patterns.
- Update tests and docs when behavior changes or public interfaces move.
- Do not commit secrets, credentials, ad-hoc exports, or large generated artifacts unless the repository already tracks them intentionally.
- Prefer the existing automation and CI workflow over one-off commands when both paths exist.
- Legacy agent guidance exists in `CLAUDE.md`; keep it aligned with `AGENTS.md` if those files remain in use.

## Verified Commands
- Install: `pnpm install`
- Dev: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`

## Change Checklist
- Run the relevant tests or static checks for the files you changed before finishing.
- Keep human-facing docs aligned with behavior changes.
- If the repo has specialized areas later, add nested `AGENTS.md` files close to that code instead of overloading the root file.

## Notes
- CI source of truth lives in `.github/workflows/`.

This file should stay short, specific, and current. Update it whenever the repo's real setup or verification steps change.
