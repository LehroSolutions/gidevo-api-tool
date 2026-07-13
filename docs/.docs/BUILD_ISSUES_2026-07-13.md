# Build Issues — 2026-07-13

**Counterparts:** [HTML](BUILD_ISSUES_2026-07-13.html) · [JSON](BUILD_ISSUES_2026-07-13.json)

- **Section:** Evidence logs
- **Audience:** Maintainers and release engineers
- **Use when:** Reviewing the Bun/js-yaml v4 build failure and remediation.
- **Status:** Current
- **Last reviewed:** 2026-07-13

## Failure

`bun run build` exposed three production TypeScript errors because js-yaml v4 removed the deprecated `yaml.safeLoad` alias from its typings. The Go strategy test contained two matching deprecated calls.

## Resolution

Migrated all five call sites to `yaml.load`, the js-yaml v4 parser API:

- `src/cli/commands/validate.ts`
- `src/core/generator.ts`
- `src/core/validator.ts`
- `tests/goStrategy.test.ts`

Also removed the stale `package-lock.json`, aligned package metadata to Bun 1.3.14, and updated dependency workflows to Node 24 plus Bun.

## Verification

- Source-wide scan finds no `safeLoad` or `safeDump` calls.
- TypeScript CLI entrypoint transpilation passes.
- Full `bun run build` must run in an installed checkout with the supplied `bun.lock`.

## Related guides

- [Current quality guide](../current/quality.md)
- [Current evidence log](../current/evidence-log.md)
- [Current security guide](../current/security.md)
