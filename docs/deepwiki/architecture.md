# Architecture Overview

This document provides a high-level view of GIDEVO-API TOOL's architecture.

## Core Components

- **CLI Entry Point**: `src/cli/index.ts` uses `commander` to parse commands and global flags.
- **Commands**: Each command (`init`, `generate`, `validate`, `login`, `logout`, `whoami`, `plugin`) is implemented in `src/cli/commands/*.ts`.
- **Core Logic**: Business logic lives in `src/core`:
  - `AuthService` handles authentication state, storing tokens under `~/.gidevo-api-tool/config.json`.
  - `Validator` parses and validates API specs (OpenAPI & GraphQL).
  - `CodeGenerator` generates multi-language SDKs via plugin abstraction.

## Modules & Dependency Flow

1. **CLI**: Parses input, global flags, then delegates to command handlers.
2. **Command Handler**: Validates inputs (file existence, flags) and invokes core services.
3. **Core Services**: Perform filesystem operations, parsing, and codegen.
4. **Plugins**: Located in `dist/plugins` (JavaScript) or `src/plugins` during dev, loaded dynamically.
5. **Output**: Files written to target directories (`specs`, `generated`, etc.).

## Key Patterns

- **Dynamic Plugin Loading**: Only `.js` files are discovered; supports TypeScript dev and JavaScript dist.
- **Config Persistence**: Auth config written and read via JSON for simplicity.
- **ESM Interop**: Spinner uses dynamic ESM import to avoid Jest issues.

For further details, see [Plugin System Design](plugin-design.md).