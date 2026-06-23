# Development workflow

Active contributors: Yifeng Wang

This page describes the day-to-day branch, code, test, and PR cycle for the repository.

## Branching

The default branch is `main`. Create feature branches from `main` and open pull requests back to `main`. There is no release branch; every merge to `main` is considered stable enough for CI and the live playground (which deploys automatically).

## Local setup

```bash
# Clone and install the core library
git clone git@github.com:fpcMotif/typed-japanese.git
cd typed-japanese
pnpm install

# Install the playground separately
cd playground
pnpm install
```

## Making changes

1. Edit the relevant files under `src/` or `playground/src/`.
2. If you changed grammar types, add or update an example in `src/examples/`.
3. If you changed the course or glossary, run the verification scripts inside `playground/`.

## Testing before a PR

Run these commands in order:

```bash
# In the repo root
pnpm test

# In playground/
pnpm typecheck
pnpm verify:snippets
pnpm verify:vocab
```

The root `pnpm test` runs `typecheck` and `lint`. The playground has its own `tsconfig.json` and must be checked separately.

## PR checklist

- [ ] `pnpm test` passes at the root.
- [ ] `pnpm typecheck` passes inside `playground/`.
- [ ] Course snippets and vocabulary remain consistent (`pnpm verify:snippets`, `pnpm verify:vocab`).
- [ ] New examples include `@ts-expect-error` for incorrect forms.
- [ ] Bilingual strings are provided for new UI text.
- [ ] No raw hex values in CSS; only design tokens are used.

## Merge and deploy

Once a PR is merged to `main`, the GitHub Actions workflow in `.github/workflows/ci.yml` runs the root test suite. The deploy workflow in `.github/workflows/deploy-playground.yml` builds the playground and pushes it to GitHub Pages.
