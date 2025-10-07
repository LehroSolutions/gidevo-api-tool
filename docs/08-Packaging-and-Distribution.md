# 08-Packaging-and-Distribution.md

# Packaging & Distribution

## 1. CI/CD Pipeline Configuration

### Build & Test Stage
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python & Node.js
        uses: actions/setup-python@v4
        with: { python-version: '3.x' }
      - uses: actions/setup-node@v3
        with: { node-version: '18.x' }
      - name: Install Dependencies
        run: |
          pip install poetry
          poetry install
          npm install
      - name: Run Tests
        run: |
          pytest --cov=src
          npm test -- --coverage
```

### Release Stage
```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Env
        run: |
          pip install poetry
          npm install -g npm@latest semantic-release
      - name: Publish Python Package
        run: |
          poetry version ${GITHUB_REF#refs/tags/}
          poetry build
          poetry publish --username ${{ secrets.PYPI_USER }} --password ${{ secrets.PYPI_PASS }}
      - name: Publish npm Package
        run: |
          npm version ${GITHUB_REF#refs/tags/} --no-git-tag-version
          npm publish --access public
```

## 2. Versioning Strategy
- **Semantic Versioning**: MAJOR.MINOR.PATCH.
- **Automated Bumping**: use `semantic-release` or `poetry version`.
- **Tagging**: Git tags prefixed with `v`, e.g., `v1.2.0`.

## 3. Registry Publishing

### Python (PyPI)
- Artifact Types: `sdist` and `wheel`.
- Private registries via Artifactory or Nexus can mirror PyPI.
- Credentials stored in CI secrets.

### JavaScript (npm)
- Scoped packages: `@company/gidevo-api-tool`.
- Public vs private access (`--access public`).
- Lockfile maintenance (package-lock.json / pnpm-lock.yaml).

### Docker
- Multi-arch builds via Docker Buildx.
- Tagging strategy: `latest`, `v1.2.0`, `sha-<short>`.
- Push to Docker Hub or private registry.
```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t company/gidevo-api-tool:latest \
  -t company/gidevo-api-tool:v1.2.0 \
  --push .
```

## 4. Changelog & Release Notes
- **Keep a `CHANGELOG.md`** following Keep a Changelog spec.
- Automate generation via `github-release-notes` or `conventional-changelog`.

### Example Entry
```md
## [1.2.0] - 2025-08-10
### Added
- Support for plugin auto-discovery
- New GraphQL subscription client

### Fixed
- Retry logic in HTTP transport
```

## 5. Distribution Best Practices
- Sign packages (GPG for Python, npm signatures).
- Verify checksums on CI and client install.
- Provide offline/tarball archives.

## 6. Documentation and Samples
- Publish docs to GitHub Pages or ReadTheDocs.
- Include sample apps and quickstart guides in releases.

---
*Next:* Draft `09-Deployment-and-Integration.md` with containerization, platform-specific tips, SDK integration examples, and troubleshooting.
