# GIDEVO-API TOOL
<!-- CI and Quality Badges -->
[![CI](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml)
[![CodeQL](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml)

> Enterprise-grade API integration tool with plugin architecture and multi-language code generation.

## Features

- **Project Initialization**: `gidevo-api-tool init` scaffolds OpenAPI or GraphQL projects.
- **Code Generation**: `gidevo-api-tool generate` produces SDKs (TypeScript, Python).
- **Specification Validation**: `gidevo-api-tool validate` checks OpenAPI/GraphQL specs.
- **Authentication**: `gidevo-api-tool login` manages API tokens.
- **Plugin System**: Extend functionality by adding plugins in `src/plugins/`.
 - **Accessible UX**: Progress spinners with opt-out flags and environment overrides for CI accessibility.

## Installation

```bash
npm install -g gidevo-api-tool
```

## CLI Usage

### Disabling Spinners / Colors (CI & Accessibility)

Spinners and colors are enabled by default for TTY terminals. Disable them via:

```bash
gidevo-api-tool generate --no-spinner --no-color
```

Or environment variables:

```bash
NO_SPINNER=1 NO_COLOR=1 gidevo-api-tool generate --spec ./specs/api.yaml
```

This helps in CI logs and for screen readers.

### Initialize a Project

```bash
gidevo-api-tool init --template openapi --output ./my-api-client
```

### Generate SDK

```bash
gidevo-api-tool generate --spec ./specs/api.yaml --language typescript --output ./generated
```

### Validate Spec

```bash
gidevo-api-tool validate ./specs/api.yaml
```

### Login

```bash
gidevo-api-tool login --token YOUR_API_TOKEN
```

Or set environment variable (useful for CI):

```bash
set GIDEVO_API_TOKEN=YOUR_API_TOKEN & gidevo-api-tool generate --spec ./specs/api.yaml
```

### Logout

```bash
gidevo-api-tool logout
```
Removes stored credentials from your user config directory.

### WhoAmI

Display current authentication status:

```bash
gidevo-api-tool whoami
```

## Programmatic Usage

You can also use the generator and validator in Node.js:

```ts
import { CodeGenerator, Validator } from 'gidevo-api-tool';

async function build() {
  const generator = new CodeGenerator();
  await generator.generate({ spec: './specs/api.yaml', language: 'typescript', outputDir: './generated' });

  const validator = new Validator();
  const result = await validator.validate('./specs/api.yaml');
  if (!result.valid) console.error(result.errors);
}
build();
```

## Plugin Development

1. Create a new plugin file in `src/plugins/`, exporting default class implementing:
   ```ts
   interface Plugin {
     name: string;
     initialize(options?: any): void;
     run(...args: any[]): Promise<boolean>;
   }
   ```
2. Build and place compiled `.js` in `dist/plugins/` for runtime loading.
3. Plugins are auto-discovered from `src/plugins/`.

## Development & Testing

```bash
git clone <repo>
npm install
npm run build
npm test
```

## Documentation

See the `docs/` directory for detailed guides:
- 01-Requirements-and-Use-Cases.md
- 02-Architecture-and-Design.md
- 03-Tech-Stack-Selection.md
- 04-API-Specification.md
- 06-Security-and-Authentication.md
- 07-Testing-and-QA.md
- 08-Packaging-and-Distribution.md
- 09-Deployment-and-Integration.md
- 10-Monitoring-and-Logging.md
- 11-Versioning-and-Maintenance.md
- 12-Pricing-and-Revenue-Models.md

## DeepWiki

Dive into our in-depth internal documentation for design decisions, UX guidelines, plugin architecture, and CI/CD workflows:
- [Architecture Overview](docs/deepwiki/architecture.md)
- [CLI UX & Accessibility](docs/deepwiki/cli-ux.md)
- [Plugin System Design](docs/deepwiki/plugin-design.md)
- [CI/CD & Release Pipeline](docs/deepwiki/ci-cd.md)

## Contributing

Please open issues or pull requests. Follow code style and include tests for new functionality.

## License

This project is dual-licensed. You may choose EITHER of the following:

- Open Source: Apache License 2.0 — see `LICENSE-APACHE`
- Commercial: LEHRO Solutions Commercial License — see `LICENSE-COMMERCIAL` or contact sales@lehrosolutions.com

Summary: see `LICENSE`.

SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial

---
© 2025 LEHRO Solutions
