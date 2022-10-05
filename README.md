# boilerplate-typescript-package

Boilerplate for a TypeScript npm package

[![ci](https://github.com/jessety/boilerplate-typescript-package/workflows/ci/badge.svg)](https://github.com/jessety/boilerplate-typescript-package/actions/workflows/ci.yml)

## Includes

- TypeScript configuration
- `ts-jest` setup for automated testing
- ESLint rules & `editorconfig` for linting
- Prettier and ESLint for deterministic code formatting
- CI - build, lint & test
- CD - automated publishing to both [npm](https://www.npmjs.com/) and the [GitHub Package Registry](https://github.com/features/packages)
- GitHub Releases generated with automatic changelogs populated via a configurable template
- Dependabot configuration
- VSCode settings

## Release / Publish

Publishing is handled by a continuous delivery workflow within GitHub Actions. By default, new versions are dual-published to both `npm` and `gpr` (the GitHub Package Registry.) Comment one out in `.github/workflows/publish.yml` to only use one. If you would like to publish to `npm`, create a `NPM_TOKEN` repository secret. Publishing to `gpr` does not require an auth token.

First, determine what kind of [semantic versioning](https://semver.org) bump this release will require. Updates should fall into one of three categories: `major` (new functionality with breaking changes) `minor` (new functionality without breaking changes) or `patch` (backwards compatible bug fixes).

To publish a new release, checkout the make sure your git repository is clean and run one of the following commands:

- `npm run release:major` (new functionality with breaking changes)
- `npm run release:minor` (new functionality without breaking changes)
- `npm run release:patch` (backwards compatible bug fixes)

Running any one of these will:

1. Increment the version number in `package.json`
2. Create a git tag with the new version number
3. Push these changes to GitHub, which triggers the `release` workflow in GitHub Actions
4. The `release` workflow then creates a new GitHub release with changelog automatically populated with all PRs and commits since the last version
5. The `publish` workflow is then triggered when the `release` workflow completes. It compiles the package and pushes it up to `npm` / `gpr`
