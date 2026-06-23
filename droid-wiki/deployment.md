# Deployment

Active contributors: Yifeng Wang

Typed Japanese has two deployment surfaces: the npm-style type library (published as a package) and the interactive playground (deployed to GitHub Pages).

## The core library

The root package is `@typedgrammar/typed-japanese`. It is built with `pnpm build`, which runs `tsc` and emits `.d.ts` and `.js` files to `dist/`. The `package.json` points `main` to `dist/index.js` and `types` to `dist/index.d.ts`. The package is not currently published automatically; publishing is a manual step.

## The playground

The playground is deployed automatically on every push to `main` via the workflow in `.github/workflows/deploy-playground.yml`. It uses GitHub's native Pages deployment:

1. The `build` job installs pnpm and Node 22, installs dependencies inside `playground/`, and runs `pnpm build`.
2. The build output (`playground/dist`) is uploaded as a Pages artifact.
3. The `deploy` job deploys the artifact to the `github-pages` environment.

The live URL is `https://typedgrammar.github.io/typed-japanese/`.

## CI pipeline

`.github/workflows/ci.yml` runs on every push and pull request to `main`. It checks out the repo, installs pnpm 9 and Node 22, installs dependencies, and runs `pnpm test` at the root. This covers the core library typecheck and lint, but not the playground build. The playground is tested during the deploy workflow instead.

## Concurrency

The deploy workflow sets `concurrency: group: pages` so only one deployment runs at a time. In-progress runs are canceled when a new one starts, which prevents stale deployments from overwriting a newer build.

## Manual deployment

You can trigger the playground deploy manually from the GitHub Actions tab using the `workflow_dispatch` event. This is useful for redeploying without a code change.

## Environments

The only environment is GitHub Pages (`github-pages`). The core library does not use environments; it is built locally and published to npm manually when needed.
