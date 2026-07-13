# Build Issues — 2026-07-13

**Counterparts:** [HTML](BUILD_ISSUES_2026-07-13.html) · [JSON](BUILD_ISSUES_2026-07-13.json)

- **Section:** Evidence logs
- **Audience:** Maintainers and release engineers
- **Use when:** Reviewing the Bun/js-yaml v4 build failure and its remediation.
- **Status:** Current
- **Last reviewed:** 2026-07-13

## Failure

`bun run build` failed in three production files because `yaml.safeLoad` was removed from js-yaml v4 typings. Two Go strategy test calls used the same removed alias.

## Resolution

Replaced all five `yaml.safeLoad(...)` calls with `yaml.load(...)` in:

- `src/cli/commands/validate.ts`
- `src/core/generator.ts`
- `src/core/validator.ts`
- `tests/goStrategy.test.ts`

## Verification

- Source-wide scan: no `safeLoad` or `safeDump` references remain.
- CLI entrypoint syntax/transpile check passed.
- Full dependency-backed `tsc` must be rerun with `bun run build` in the installed checkout.

## Related guides

- [Current quality guide](../current/quality.md)
- [Current evidence log](../current/evidence-log.md)
- [Current security guide](../current/security.md)
