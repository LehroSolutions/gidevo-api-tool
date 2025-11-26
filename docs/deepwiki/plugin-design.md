# Plugin System Design

The plugin system enables extensibility for spec validation, code generation, and custom operations.

## Plugin Contract

Plugins must export a class or object matching:

```ts
interface Plugin {
  name: string;
  initialize(options?: any): void;
  run(...args: any[]): Promise<boolean>;
}
```

## Discovery & Loading

- **Directories**: Looks for `dist/plugins` first, then `src/plugins` during development.
- **File Filter**: Only files ending `.js` are loaded (avoids TS and d.ts).
- **Instantiation**:
  - If default export is a constructor, instantiate it.
  - Otherwise, use the exported object.

## CLI Integration

- `plugin <name> [args...]` command finds plugin by `name` case-insensitive.
- Calls `plugin.run(...args)` and logs success/failure.

## Example Plugin: SpecLint

Validates OpenAPI spec using `js-yaml`:
- Reports schema issues.
- Test coverage via `tests/specLint.test.ts`.

For core usage, refer to [CI/CD & Release Pipeline](ci-cd.md).