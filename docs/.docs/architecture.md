# GIDEVO API Tool Architecture

  ## Intent
  Agentic CLI for OpenAPI validation, multi-language SDK synthesis, plugins, and secure secret storage.

  ## Runtime shape
  - Domain: **API tooling / SDK generation**
  - Primary stack: Node.js, TypeScript, Commander, Handlebars, AJV, js-yaml
  - Key entrypoints:
- `src/cli/index.ts`
- `src/core/generator.ts`
- `src/core/validator.ts`
- `src/core/secrets.ts`

  ## Boundaries
  - Validate inputs at trust boundaries.
  - Keep authorization explicit near data access.
  - Prefer recoverable errors over silent failure.
  - Keep side effects isolated and observable.

  ## Related
  - [Design System](./design-system.md)
  - [Security](./security.md)
  - [ADR-0001](./adr-0001-docs-system.md)
  - [Roadmap](./roadmap.md)
