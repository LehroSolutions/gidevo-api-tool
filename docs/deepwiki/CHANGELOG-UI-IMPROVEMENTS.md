# Changelog: UI Improvements & Bug Fixes

**Date:** November 26, 2025  
**Version:** 0.1.4 → 0.1.5

## Overview

This update focuses on significantly improving the CLI user experience with a new comprehensive UI system, fixing corrupted templates, enhancing error handling, and improving code quality throughout the application.

---

## 🎨 New UI System

### Created `src/cli/utils/ui.ts`

A comprehensive UI utility module providing consistent, beautiful CLI output:

#### Features

| Feature | Description |
|---------|-------------|
| **ASCII Banner** | Professional branding with GIDEVO logo |
| **Compact Banner** | Lighter banner for subcommands |
| **Styled Messages** | Success (✓), Error (✗), Warning (⚠), Info (ℹ) |
| **Tables** | Formatted tables with headers and borders |
| **Progress Steps** | `[1/4] Step description...` format |
| **Dividers** | Visual separators between sections |
| **Next Steps** | Helpful suggestions after command completion |
| **File Paths** | Cyan-highlighted file paths |
| **Timestamps** | Formatted date/time display |
| **Color Theme** | Consistent brand colors (Blue, Green, Amber) |

#### Usage Example

```typescript
import { ui } from './cli/utils/ui';

ui.showCompactBanner();
ui.sectionHeader('Code Generation');
ui.table(['Setting', 'Value'], [['Language', 'typescript']]);
ui.step(1, 3, 'Validating specification...');
ui.success('Generation completed!', 'Duration: 500ms');
ui.nextSteps(['Review generated code', 'Install dependencies']);
```

---

## 🔧 Bug Fixes

### 1. Corrupted Handlebars Templates

**Problem:** The TypeScript and Python templates had malformed/duplicated content causing parse errors.

**Solution:** Completely rewrote all templates:

- `src/templates/typescript/client-rest.hbs` - Full REST client with interceptors, error handling
- `src/templates/typescript/types.hbs` - Clean type definitions with documentation
- `src/templates/python/client.hbs` - Complete Python client with dataclasses, type hints

### 2. AuthService Private Property Access

**Problem:** `whoamiCommand` was accessing private `configFile` property using `(authService as any).configFile`.

**Solution:** Added proper public methods to `AuthService`:

```typescript
// New methods added to AuthService
getConfig(): AuthConfig | null
isAuthenticated(): boolean
isTokenExpired(): boolean
getTokenValidityDays(): number | null
getConfigDir(): string
```

### 3. Silent Failures on Errors

**Problem:** Commands were returning instead of exiting with proper error codes.

**Solution:** All commands now call `process.exit(1)` on errors, enabling proper CI/CD integration.

### 4. Missing Input Validation

**Problem:** Commands accepted invalid input without helpful error messages.

**Solution:** Added validation for:
- Required `--spec` option in generate command
- Valid template types (`openapi`, `graphql`)
- Valid language options (`typescript`, `python`)
- Token length validation in login command

---

## 📝 Enhanced Commands

### `init` Command
- Shows progress steps (1/4, 2/4, etc.)
- Creates README.md with project documentation
- Displays file structure table after creation
- Shows "Next Steps" suggestions

### `generate` Command
- Configuration table showing spec, language, output
- Lists all generated files on completion
- Shows generation duration
- Better error messages for missing spec

### `validate` Command
- Shows specification info on success (OpenAPI version, title, endpoint count)
- Clear error listing with numbered errors
- Suggests next steps on validation failure

### `login` Command
- Checks for existing authentication first
- Prompts to replace existing credentials
- Token length validation
- Shows confirmation and next steps

### `logout` Command
- Confirms current auth status before logout
- Shows next steps for re-authentication

### `whoami` Command
- Shows detailed auth info
- Displays days until token expiry
- Warns when token is expiring soon
- Shows config directory location

### `plugin` Command
- Added `plugin list` subcommand
- Better error messages when plugin not found
- Lists available plugins on error

---

## 🆕 New Features

### Command Aliases

| Command | Alias |
|---------|-------|
| `init` | `i` |
| `generate` | `gen` |
| `validate` | `val` |
| `plugin` | `p` |

### Extended Help

Each command now includes:
- Detailed examples
- Supported options/values
- Usage tips

### Quiet Mode

```bash
gidevo-api-tool --quiet generate -s api.yaml
```

Suppresses banner and non-essential output.

### Exported UI for Plugins

Plugin developers can use the UI utilities:

```typescript
import { ui } from 'gidevo-api-tool';

ui.success('Plugin completed!');
```

---

## 🧪 Test Updates

### Updated Tests
- `tests/e2e.test.ts` - Updated string matching for new output
- `tests/validateCommand.test.ts` - Added exit code testing
- `tests/generateCommand.test.ts` - Added mock for console.log
- `tests/whoami.test.ts` - Updated for new output format
- `tests/pluginCommand.test.ts` - Fixed completion message check
- `tests/noSpinner.test.ts` - Updated success message check

### New Snapshots
- Regenerated snapshots for TypeScript client output
- Regenerated snapshots for Python client output

### Test Results
```
Test Suites: 11 passed, 11 total
Tests:       29 passed, 29 total
Snapshots:   2 passed, 2 total
```

---

## 📁 Files Changed

### New Files
- `src/cli/utils/ui.ts` - UI utilities module

### Modified Files
- `src/cli/index.ts` - Added UI import, command aliases, extended help
- `src/cli/commands/init.ts` - Complete rewrite with new UI
- `src/cli/commands/generate.ts` - Complete rewrite with new UI
- `src/cli/commands/validate.ts` - Complete rewrite with new UI
- `src/cli/commands/login.ts` - Complete rewrite with new UI
- `src/cli/commands/logout.ts` - Complete rewrite with new UI
- `src/cli/commands/whoami.ts` - Complete rewrite with new UI
- `src/cli/commands/plugin.ts` - Complete rewrite with new UI
- `src/core/auth.ts` - Added new public methods
- `src/core/logger.ts` - Enhanced with child loggers, level checking
- `src/index.ts` - Added new exports
- `src/templates/typescript/client-rest.hbs` - Complete rewrite
- `src/templates/typescript/types.hbs` - Complete rewrite
- `src/templates/python/client.hbs` - Complete rewrite

### Test Files Updated
- `tests/e2e.test.ts`
- `tests/validateCommand.test.ts`
- `tests/generateCommand.test.ts`
- `tests/whoami.test.ts`
- `tests/pluginCommand.test.ts`
- `tests/noSpinner.test.ts`
- `tests/__snapshots__/generateCommand.test.ts.snap`

---

## 🔜 Remaining Work

### From Previous Roadmap (Updated Status)

| Item | Priority | Status |
|------|----------|--------|
| Templating Engine | High | ✅ Completed (Fixed) |
| Plugin System | High | ✅ Completed |
| CI/Lint/Tests | High | ✅ Completed |
| Full OpenAPI Validation | Medium | ✅ Completed |
| Telemetry | Medium | ✅ Completed |
| Observability | Medium | ✅ Completed |
| **UI Improvements** | **Medium** | **✅ Completed** |
| **Interactive Mode** | **Low** | **✅ Completed** |
| **Config File Support** | **Low** | **✅ Completed** |
| **Example Projects** | **Low** | **✅ Completed** |
| Advanced Language Features | Low | 🔲 Not Started |
| Security Review | Low | 🔲 Not Started |

---

## Breaking Changes

None. All changes are backward compatible.

---

## Migration Guide

No migration required. Users can update and use the new features immediately.

---

## Contributors

- UI System Implementation
- Template Fixes
- Test Updates
