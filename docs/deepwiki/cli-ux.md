# CLI UX & Accessibility

The v0.2 CLI keeps GIDEVO branding but uses direct developer language. Commands should say what they do: generate, validate, configure, diagnose, and run workflows.

## Design Principles

- Prefer clear action labels over abstract terminology.
- Keep output useful in terminals, CI logs, and screen readers.
- Use color as enhancement only; never rely on color for meaning.
- Provide JSON output for automation where workflows need machine-readable state.

## Global Flags

| Flag | Description |
| --- | --- |
| `--no-spinner` | Disable animated spinners. |
| `--no-color` | Disable ANSI color output. |
| `--no-plugins` | Disable plugin loading. |
| `-q, --quiet` | Suppress banners and non-essential output. |
| `-i, --interactive` | Run the guided wizard. |

## Agentic Commands

`doctor` is read-only and reports project health:

```bash
gidevo-api-tool doctor --spec ./specs/api.yaml
gidevo-api-tool doctor --spec ./specs/api.yaml --json
```

`workflow` validates before generation:

```bash
gidevo-api-tool workflow --spec ./specs/api.yaml --language typescript --output ./generated
gidevo-api-tool workflow --spec ./specs/api.yaml --language go --dry-run --json
```

## Message Style

Message headings use familiar labels:

```text
[OK]
[WARN]
[ERROR]
[INFO]
```

Section names are concise:

```text
SDK GENERATION
SPECIFICATION VALIDATION
PROJECT DOCTOR
AGENTIC WORKFLOW
```

## JSON Output

Use `--json` on `doctor` and `workflow` when another tool or CI job needs structured output. JSON mode must not print banners or colored prose.

## Related ADRs

- [ADR-004: Developer-Clear Agentic CLI](ADR-004-Developer-Clear-Agentic-CLI.md)
- [ADR-003: Avant-Garde UI Overhaul](ADR-003-Avant-Garde-UI-Overhaul.md)
