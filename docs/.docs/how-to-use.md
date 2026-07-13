# How to Use GIDEVO API Tool

GIDEVO validates specs and generates SDKs (TypeScript, Python, Go).

## 1) Install

```bash
bun install
bun run build
```

## 2) First successful flow

```bash
node dist/cli/index.js doctor --spec ./tests/fixtures/api.yaml
node dist/cli/index.js validate ./tests/fixtures/api.yaml
node dist/cli/index.js generate -s ./tests/fixtures/api.yaml -l typescript -o ./output
node dist/cli/index.js workflow --spec ./tests/fixtures/api.yaml --language typescript --output ./generated
```

## 3) Common commands
- `init` scaffold project
- `doctor` health checks
- `validate` / `generate` / `workflow`
- `login` / `logout` / `whoami`
- `plugin` extension runtime

## 4) Production tips
- Treat specs as untrusted input boundaries
- Prefer `workflow --dry-run` before writing shared dirs
- Keep tokens out of shell history

## Related
- [INSTALL.md](../../INSTALL.md)
- [Architecture](./architecture.md)
- [Security](./security.md)
