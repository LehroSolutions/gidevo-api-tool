# DeepWiki Index

Welcome to the DeepWiki for GIDEVO-API TOOL. This section contains in-depth documentation on architecture, CLI UX, plugin design, and CI/CD.

## Core Documentation

- [Architecture Overview](architecture.md)
- [CLI UX & Accessibility](cli-ux.md)
- [Extension System Design](plugin-design.md)
- [CI/CD & Release Pipeline](ci-cd.md)

## Architecture Decision Records (ADRs)

- [ADR-001: Plugin Architecture](ADR-001-Plugin-Architecture.md)
- [ADR-002: UI System Architecture](ADR-002-UI-System-Architecture.md)
- [ADR-003: Avant-Garde UI Overhaul](ADR-003-Avant-Garde-UI-Overhaul.md)

## Project Status & Roadmap

- [Implementation Roadmap](NEXT-STEPS-IMPLEMENTATION-ROADMAP.md)
- [UI Improvements Changelog](CHANGELOG-UI-IMPROVEMENTS.md)

## Quick Links

| Resource | Description |
|----------|-------------|
| [README](../../README.md) | Project overview and quick start |
| [RELEASE](../../RELEASE.md) | Release notes |
| [LICENSE](../../LICENSE) | License information |

## Recent Updates (March 2026)

### Generator Expansion
- Added `go` as a first-class SDK generation target.
- Added Go strategy and templates (`client.go`, `types.go`).
- Added built-in `goGenerator` plugin.

### Security Hardening
- Added project-bounded path safety defaults for spec/output resolution.
- Added explicit unsafe-path overrides:
  - `--allow-outside-project`
  - `generate.allowOutsideProject`
  - `GIDEVO_ALLOW_UNSAFE_PATHS=1`
- Hardened plugin loader path and file checks.
- Tightened encrypted secret payload validation.

### CI and Quality
- Added Semgrep checks in CI using `.semgrep.yml`.
- Updated tests/snapshots for Go generation and path/security behavior.

## Previous Updates (November-December 2025)

- UI and CLI UX overhaul.
- Interactive mode and command aliases.
- Broader test and documentation coverage.
