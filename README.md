# GIDEVO API Tool

[![CI](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml)
[![CodeQL](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml)

Agentic API integration and SDK generation CLI for OpenAPI and GraphQL projects.

## Requirements

- Node.js 24 or newer.
- CI tests run on Node 24 LTS and Node 26 Current.
- v0.2 is ESM-first. Programmatic imports should use ESM `import`.

## Install

```bash
bun install && bun run build
```

## Quick Start

```bash
gidevo-api-tool doctor --spec ./specs/api.yaml
gidevo-api-tool workflow --spec ./specs/api.yaml --language typescript --output ./generated
```

The `workflow` command validates first, then generates the SDK. Use `--dry-run` to inspect the plan without writing files.

```bash
gidevo-api-tool workflow --spec ./specs/api.yaml --language go --dry-run --json
```

## Commands

| Command                       | Alias | Purpose                                                  |
| ----------------------------- | ----- | -------------------------------------------------------- |
| `init`                        | `i`   | Create an OpenAPI or GraphQL project scaffold.           |
| `doctor`                      |       | Run read-only project health checks.                     |
| `workflow`                    |       | Validate a spec and generate an SDK in one agentic flow. |
| `generate`                    | `gen` | Generate TypeScript, Python, or Go SDK files.            |
| `validate`                    | `val` | Validate OpenAPI or GraphQL specs.                       |
| `config`                      |       | Create or inspect `.gidevorc.json`.                      |
| `plugin`                      | `p`   | Run a loaded plugin.                                     |
| `login` / `logout` / `whoami` |       | Manage local API-token state.                            |

## Agentic Workflow

`doctor` checks the local project without writing files:

```bash
gidevo-api-tool doctor --spec ./specs/api.yaml
gidevo-api-tool doctor --spec ./specs/api.yaml --json
```

Checks include:

- Node runtime compatibility.
- Config-file validity.
- Plugin loading.
- Spec readability and validation.
- Output path safety.

`workflow` combines the most common local loop:

```bash
gidevo-api-tool workflow \
  --spec ./specs/api.yaml \
  --language typescript \
  --output ./generated
```

Supported languages:

- `typescript`
- `python`
- `go`

## Existing Direct Commands

```bash
gidevo-api-tool init --template openapi --output ./my-api
gidevo-api-tool validate ./specs/api.yaml --strict
gidevo-api-tool generate --spec ./specs/api.yaml --language go --output ./generated
```

## Config

Create a project config:

```bash
gidevo-api-tool config --init
```

Example `.gidevorc.json`:

```json
{
  "generate": {
    "spec": "./specs/api.yaml",
    "language": "typescript",
    "output": "./generated",
    "allowOutsideProject": false
  },
  "validate": {
    "strict": false
  }
}
```

Command-line flags override config values.

## CI And Accessibility

Global flags:

- `--no-spinner` disables animated spinners.
- `--no-color` disables ANSI colors.
- `--quiet` suppresses banners and non-essential output.
- `--json` is available on `doctor` and `workflow` for automation.

## Path Safety

By default, spec and output paths must stay inside the current project root. Explicit overrides:

```bash
gidevo-api-tool generate --spec api.yaml --output ../external --allow-outside-project
GIDEVO_ALLOW_UNSAFE_PATHS=1 gidevo-api-tool workflow --spec api.yaml
```

## Programmatic Usage

```ts
import { CodeGenerator, Validator } from 'gidevo-api-tool';

const validator = new Validator();
const result = await validator.validate('./specs/api.yaml', { strict: true });

if (result.valid) {
  const generator = new CodeGenerator();
  await generator.generate({
    spec: './specs/api.yaml',
    language: 'typescript',
    outputDir: './generated',
  });
}
```

## Development

```bash
bun install
bun run build
bun test -- --runInBand
bun run lint
bun run format:check
```

## v0.2 Upgrade Notes

- Node 18 and Node 20 are no longer supported.
- The package is ESM-first.
- The CLI voice now uses clear developer terminology by default.
- New `doctor` and `workflow` commands provide the agentic project loop.

## License

Copyright © 2026 Lehro Solutions. Licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE).

## Documentation

Canonical docs hub: [`docs/.docs/index.md`](docs/.docs/index.md)

## Package manager (Bun)

This package is **Bun-first**.

```bash
bun install
bun run dev    # if defined
bun run build  # if defined
bun test       # or: bun run test
```

- Lockfile target: `bun.lock` (generate locally with `bun install`)
- `packageManager` field pins Bun via Corepack-compatible tooling ecosystems
- Node remains a compatibility runtime floor; prefer Bun for install/run/test

See docs for the package-manager decision: search for `ADR-0003` in `docs/.docs/` when present.

## How to use

See [docs/how-to-use.md](docs/how-to-use.md) for the full operator guide.

## Security

See [SECURITY.md](SECURITY.md).

<!-- docs-system:start -->
## Documentation

The current public documentation is available in [`docs/index.html`](docs/index.html). Start with [`docs/current/start-here.md`](docs/current/start-here.md) for scope, current changes, workflows, architecture, security, quality, and contribution guidance.

### Latest public changes

- Doctor diagnostics and workflow commands
- Go, Python, and TypeScript generation targets
- Project-bounded path safety and hardened plugin loading

Documentation is maintained as canonical Markdown plus generated HTML and JSON counterparts. Run `pnpm docs:build` after changing `docs/current/*.md` and `pnpm docs:check` before a public release.
<!-- docs-system:end -->
