# Release Process

1. Ensure main branch is green (build, lint, tests pass).
2. Update CHANGELOG.md (if present) or summarize changes in release notes.
3. Choose version bump:
   - Patch: `npm run release:patch`
   - Minor: `npm run release:minor`
   - Major: `npm run release:major`
4. Push tags: The release script already pushes tags.
5. Create GitHub Release from the new tag and paste notes.
6. Publish to npm (ensure you are logged in and have permission):

```
npm publish --access public
```

7. Announce internally & update documentation if needed.

---

## Release Notes

### v0.1.5 (November 2025)

#### 🎨 New UI System
- Comprehensive UI utilities module (`src/cli/utils/ui.ts`)
- ASCII art banner with professional branding
- Consistent success/error/warning/info messages with icons
- Progress step indicators (`[1/4] Processing...`)
- Formatted tables and dividers
- "Next Steps" suggestions after command completion
- Color theming with brand colors (Blue, Green, Amber)

#### ⚡ New Features
- **Interactive Mode** (`-i, --interactive`): Guided wizard for new users
- **Configuration File Support**: Load defaults from `.gidevorc.json`
- **Config Command**: `gidevo-api-tool config --init` to create config file
- **Command Aliases**: `gen`, `val`, `i`, `p` for faster typing
- **Quiet Mode** (`-q, --quiet`): Suppress banner and non-essential output

#### 🔧 Bug Fixes
- Fixed corrupted Handlebars templates (TypeScript & Python)
- Fixed AuthService private property access issue
- Added proper error exit codes (`process.exit(1)`)
- Added input validation for all commands

#### 📚 Examples & Documentation
- Added `examples/` directory with:
  - `basic-typescript/` - TypeScript SDK example
  - `basic-python/` - Python SDK example
  - `sample-plugin/` - Custom plugin development guide
  - `specs/` - Sample API specifications (Petstore, Todo API)
- Updated README with comprehensive documentation
- Added Architecture Decision Records (ADRs)
- Created CHANGELOG for UI improvements

#### 🧪 Test Updates
- All 29 tests passing
- Updated snapshots for new template output
- Added exit code testing for error cases

#### ⬆️ Upgrade Notes
No breaking changes. Users can update and use new features immediately.

---

### v0.1.4 (Previous)

- Initial public release
- OpenAPI validation and code generation
- TypeScript and Python SDK support
- Plugin system
- CI/CD pipeline
