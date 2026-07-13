# Security issues noticed — 2026-07-10 continuation

## Findings

- `js-yaml` was previously invoked via `yaml.load()` for OpenAPI specs.
  That accepts the full YAML type system and is unsafe for untrusted input.
- Replaced with `yaml.safeLoad()` in generator, validator, validate command,
  and Go strategy tests.

## Status

- Patched in source.
- No secrets introduced.
