# CI/CD & Release Pipeline

This section documents the current automated workflows for open-source quality and security checks.

## GitHub Actions Workflows

- **`ci.yml`** (push to `main`/`develop`, PR to `main`):
  - `test` job:
    - Runs matrix builds on Node `18.x` and `20.x`.
    - Executes `npm run lint`, `npm run format:check`, `npm run test:coverage`, and `npm run build`.
  - `security` job:
    - Runs `npm audit --audit-level high`.
    - Runs Semgrep with repository rules:
      - `semgrep --config .semgrep.yml --error src`
  - `publish` job:
    - Runs after `test` and `security`.
    - Publishes package from `main` with `npm publish --access public`.

- **`codeql.yml`**:
  - Runs CodeQL analysis for JavaScript and TypeScript on push/PR.

- **`release.yml`**:
  - Handles release automation for tagged release flow.

## Security Checks in CI

- Dependency risk gate: `npm audit --audit-level high`
- Static analysis gate: Semgrep using `.semgrep.yml`
- CodeQL analysis: separate dedicated workflow (`codeql.yml`)

## Environment Variables

- `NPM_TOKEN`: required for npm publish in `publish` job.
- `GITHUB_TOKEN`: provided automatically by GitHub Actions.

## Maintenance Notes

- Keep `.semgrep.yml` aligned with secure coding utilities (for example `safeWriteGeneratedFile()`).
- Keep CodeQL and CI workflows consistent with supported Node versions in `package.json`.
