# GIDEVO-API TOOL
<!-- CI and Quality Badges -->
[![CI](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/ci.yml)
[![CodeQL](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml/badge.svg)](https://github.com/lehrosolutions/gidevo-api-tool/actions/workflows/codeql.yml)

> Enterprise-grade API integration tool with plugin architecture and multi-language code generation.

## ✨ Features

- **🚀 Project Initialization**: `gidevo-api-tool init` scaffolds OpenAPI or GraphQL projects
- **⚡ Code Generation**: `gidevo-api-tool generate` produces production-ready SDKs (TypeScript, Python)
- **✅ Specification Validation**: `gidevo-api-tool validate` checks OpenAPI/GraphQL specs with detailed error reporting
- **🔐 Authentication**: `gidevo-api-tool login` manages API tokens securely
- **🔌 Plugin System**: Extend functionality with custom plugins
- **🎨 Professional UI**: Consistent, colorful output with progress indicators
- **♿ Accessible UX**: Full support for CI environments and screen readers

## 📦 Installation

```bash
npm install -g gidevo-api-tool
```

## 🚀 Quick Start

```bash
# Initialize a new project
gidevo-api-tool init --template openapi --output ./my-api

# Generate SDK from your spec
gidevo-api-tool generate --spec ./specs/api.yaml --language typescript --output ./sdk

# Validate your API specification
gidevo-api-tool validate ./specs/api.yaml
```

## 📖 CLI Usage

### Command Aliases

All commands have convenient short aliases:

| Command    | Alias | Description                    |
|------------|-------|--------------------------------|
| `init`     | `i`   | Initialize a new project       |
| `generate` | `gen` | Generate SDK from spec         |
| `validate` | `val` | Validate API specification     |
| `plugin`   | `p`   | Manage plugins                 |

### Quiet Mode (CI & Accessibility)

Use `--quiet` or `-q` flag to minimize output:

```bash
gidevo-api-tool --quiet generate --spec ./specs/api.yaml
```

### Disabling Spinners / Colors

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
# OpenAPI project (default)
gidevo-api-tool init --template openapi --output ./my-api-client

# GraphQL project
gidevo-api-tool init --template graphql --output ./my-graphql-client

# Short alias
gidevo-api-tool i -t openapi -o ./my-api
```

### Generate SDK

```bash
# TypeScript SDK
gidevo-api-tool generate --spec ./specs/api.yaml --language typescript --output ./generated

# Python SDK
gidevo-api-tool generate --spec ./specs/api.yaml --language python --output ./generated

# With custom template
gidevo-api-tool generate --spec ./specs/api.yaml --language typescript --template axios --output ./generated

# Short alias
gidevo-api-tool gen -s ./specs/api.yaml -l typescript -o ./generated
```

**Supported Languages:**
- `typescript` - REST client with fetch or axios templates
- `python` - Python client with requests library

### Validate Spec

```bash
# Validate OpenAPI specification
gidevo-api-tool validate ./specs/api.yaml

# Short alias
gidevo-api-tool val ./specs/api.yaml
```

**Output Example:**
```
✔ Specification is valid

📊 Specification Summary:
   Title:       My API
   Version:     1.0.0
   Paths:       5
   Schemas:     12
   Operations:  15
```

### Login

```bash
# Interactive login
gidevo-api-tool login --token YOUR_API_TOKEN
```

**Environment Variable (for CI):**

```bash
# Windows
set GIDEVO_API_TOKEN=YOUR_API_TOKEN
gidevo-api-tool generate --spec ./specs/api.yaml

# Linux/macOS
GIDEVO_API_TOKEN=YOUR_API_TOKEN gidevo-api-tool generate --spec ./specs/api.yaml
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

**Output Example:**
```
🔐 Authentication Status

   Status:      Authenticated
   Token:       gat_****...****89ab
   Expires:     in 25 days
   Config:      C:\Users\you\.config\gidevo-api-tool
```

### Plugin Management

```bash
# List available plugins
gidevo-api-tool plugin --list

# Run a specific plugin
gidevo-api-tool plugin --run specLint ./specs/api.yaml

# Short alias
gidevo-api-tool p --list
```

## 💻 Programmatic Usage

You can also use the generator and validator in Node.js:

```ts
import { CodeGenerator, Validator, AuthService } from 'gidevo-api-tool';

async function build() {
  // Check authentication
  const auth = new AuthService();
  if (auth.isAuthenticated()) {
    console.log('Authenticated!');
  }

  // Validate specification
  const validator = new Validator();
  const result = await validator.validate('./specs/api.yaml');
  if (!result.valid) {
    console.error('Validation errors:', result.errors);
    return;
  }

  // Generate SDK
  const generator = new CodeGenerator();
  await generator.generate({
    spec: './specs/api.yaml',
    language: 'typescript',
    outputDir: './generated'
  });

  console.log('SDK generated successfully!');
}

build();
```

## 🔌 Plugin Development

Create custom plugins to extend functionality:

1. Create a new plugin file in `src/plugins/`:

```ts
import { Plugin } from './plugin';

export default class MyCustomPlugin implements Plugin {
  name = 'myCustomPlugin';
  
  initialize(options?: any): void {
    // Setup code
  }
  
  async run(...args: any[]): Promise<boolean> {
    // Plugin logic
    console.log('Running my custom plugin!');
    return true;
  }
}
```

2. Build and place compiled `.js` in `dist/plugins/` for runtime loading
3. Plugins are auto-discovered from `src/plugins/`

**Built-in Plugins:**
- `specLint` - Lint API specifications for best practices
- `typescriptGenerator` - Generate TypeScript SDKs
- `pythonGenerator` - Generate Python SDKs

## 🛠️ Development & Testing

```bash
# Clone repository
git clone <repo>

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

### Project Structure

```
src/
├── index.ts          # Main exports
├── cli/
│   ├── index.ts      # CLI entry point
│   ├── commands/     # Command implementations
│   └── utils/        # CLI utilities (UI, etc.)
├── core/
│   ├── auth.ts       # Authentication service
│   ├── generator.ts  # Code generation engine
│   ├── validator.ts  # Spec validation
│   └── strategies/   # Generator strategies
├── plugins/          # Plugin system
└── templates/        # Handlebars templates
    ├── typescript/
    └── python/
```

## 📚 Documentation

See the `docs/` directory for detailed guides:

| Document | Description |
|----------|-------------|
| [01-Requirements-and-Use-Cases](docs/01-Requirements-and-Use-Cases.md) | Project requirements |
| [02-Architecture-and-Design](docs/02-Architecture-and-Design.md) | System architecture |
| [03-Tech-Stack-Selection](docs/03-Tech-Stack-Selection.md) | Technology choices |
| [04-API-Specification](docs/04-API-Specification.md) | API spec format |
| [06-Security-and-Authentication](docs/06-Security-and-Authentication.md) | Security practices |
| [07-Testing-and-QA](docs/07-Testing-and-QA.md) | Testing strategy |
| [08-Packaging-and-Distribution](docs/08-Packaging-and-Distribution.md) | Distribution |
| [09-Deployment-and-Integration](docs/09-Deployment-and-Integration.md) | Deployment guide |
| [10-Monitoring-and-Logging](docs/10-Monitoring-and-Logging.md) | Observability |
| [11-Versioning-and-Maintenance](docs/11-Versioning-and-Maintenance.md) | Version management |
| [12-Pricing-and-Revenue-Models](docs/12-Pricing-and-Revenue-Models.md) | Business model |

## 📖 DeepWiki

Dive into our in-depth internal documentation for design decisions, UX guidelines, plugin architecture, and CI/CD workflows:

| Document | Description |
|----------|-------------|
| [Architecture Overview](docs/deepwiki/architecture.md) | System architecture details |
| [CLI UX & Accessibility](docs/deepwiki/cli-ux.md) | UI system documentation |
| [Plugin System Design](docs/deepwiki/plugin-design.md) | Plugin architecture |
| [CI/CD & Release Pipeline](docs/deepwiki/ci-cd.md) | Build and release process |
| [UI System Architecture (ADR-002)](docs/deepwiki/ADR-002-UI-System-Architecture.md) | UI design decisions |
| [Plugin Architecture (ADR-001)](docs/deepwiki/ADR-001-Plugin-Architecture.md) | Plugin design decisions |
| [Changelog](docs/deepwiki/CHANGELOG-UI-IMPROVEMENTS.md) | Recent changes |
| [Implementation Roadmap](docs/deepwiki/NEXT-STEPS-IMPLEMENTATION-ROADMAP.md) | Future plans |

## 🤝 Contributing

Please open issues or pull requests. Follow code style and include tests for new functionality.

### Development Guidelines

1. Run tests before submitting PRs: `npm test`
2. Ensure linting passes: `npm run lint`
3. Update documentation for new features
4. Add appropriate test coverage

## 📄 License

This project is dual-licensed. You may choose EITHER of the following:

- Open Source: Apache License 2.0 — see `LICENSE-APACHE`
- Commercial: LEHRO Solutions Commercial License — see `LICENSE-COMMERCIAL` or contact sales@lehrosolutions.com

Summary: see `LICENSE`.

SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial

---
© 2025 LEHRO Solutions
