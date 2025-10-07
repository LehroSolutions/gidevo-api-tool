# CI/CD & Release Pipeline

This section describes the automated workflows covering testing, linting, security analysis, and publishing.

## GitHub Actions Workflows

- **`test-lint-audit.yml`**: Runs on push and PRs.
  - Installs dependencies.
  - Runs `npm test`, `npm run lint`, `npm audit --audit-level=high`.
  - Uploads coverage report.

- **`codeql-analysis.yml`**: Schedules daily scans and on pull_request.
  - Performs security analysis using CodeQL.

- **`release.yml`**: Triggered on tagged commit.
  - Uses `semantic-release` to generate changelog, create GitHub release, publish to npm.

## Release Process

1. **Tag**: Create a Git tag following semver (e.g., `v1.2.0`).
2. **CI**: `release.yml` runs semantic-release.
3. **Artifacts**: Release notes and npm package published automatically.

## Environment Variables

- `NPM_TOKEN`: For npm publish.
- GITHUB_TOKEN: Provided by GitHub Actions automatically.

## Badges & Status

- Test & coverage status in `README.md`.
- CodeQL scan status.

## Maintenance

- Update `jest.config.js` thresholds to track coverage.
- Update dependency versions in `package.json` security dashboard.
