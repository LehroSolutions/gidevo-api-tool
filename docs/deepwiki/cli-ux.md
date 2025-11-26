# CLI UX & Accessibility

Focus on clear feedback, accessibility, and CI friendliness.

---

## UI System (Updated November 2025)

The CLI now uses a comprehensive UI system (`src/cli/utils/ui.ts`) providing consistent, beautiful output.

### Banner Display

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ██████╗ ██╗██████╗ ███████╗██╗   ██╗ ██████╗              ║
║   ██╔════╝ ██║██╔══██╗██╔════╝██║   ██║██╔═══██╗             ║
║   ...                                                      ║
║                                                            ║
║   Enterprise-grade API Integration & Code Generation       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Compact Banner (for subcommands)
```
  GIDEVO API Tool ⚡
```

---

## Global Flags

| Flag | Description |
|------|-------------|
| `--no-spinner` | Disable spinners (for CI or screen readers) |
| `--no-color` | Disable ANSI color output |
| `--no-plugins` | Disable plugin loading |
| `-q, --quiet` | Suppress banner and non-essential output |

---

## Command Aliases

| Full Command | Alias |
|--------------|-------|
| `init` | `i` |
| `generate` | `gen` |
| `validate` | `val` |
| `plugin` | `p` |

---

## Message Types

### Success Messages
```
  ✓ Operation completed successfully!
    Additional details here.
```

### Error Messages
```
  ✗ Operation failed
    Error description here.
```

### Warning Messages
```
  ⚠ Warning message
    Additional context.
```

### Info Messages
```
  ℹ Information
    More details.
```

---

## Progress Indicators

### Step Progress
```
  [1/4] Creating directories...
  [2/4] Generating package.json...
  [3/4] Creating spec template...
  [4/4] Creating documentation...
```

### Configuration Tables
```
  Setting          Value
  ───────────────  ─────────────────────────────
  Spec File        /path/to/api.yaml
  Language         typescript
  Output Dir       ./generated
```

---

## Next Steps Sections

After command completion, helpful suggestions are shown:

```
  📋 Next Steps:

    1. Review generated code in ./output
    2. Install dependencies if needed
    3. Import and use the generated SDK
```

---

## Color Theme

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary (branding, headers) | Blue | #3B82F6 |
| Success | Green | #10B981 |
| Accent (warnings, highlights) | Amber | #F59E0B |
| Errors | Red | Default |
| Muted text | Gray | Default |

---

## Spinners & Feedback

- Visual spinner via `ora` shows progress for long operations
- Spinner wrapper (`createSpinner`) ensures fallback to no-op in non-TTY or CI
- Success/failure uses clear Unicode icons (✓, ✗, ⚠, ℹ)

---

## Accessibility Considerations

- `--no-spinner` flag disables animated spinners
- `--no-color` flag disables all ANSI colors
- `--quiet` flag reduces output to essentials only
- Clear text alternatives via `console.log` messages
- All dynamic output can be disabled for screen readers
- Exit codes properly set (0 for success, 1 for error)

---

## Using UI Utilities in Plugins

Plugin developers can import and use the UI system:

```typescript
import { ui } from 'gidevo-api-tool';

// In your plugin
ui.showCompactBanner();
ui.sectionHeader('My Plugin');
ui.step(1, 3, 'Processing...');
ui.success('Plugin completed!', 'Processed 10 files');
ui.nextSteps([
  'Review the output',
  'Run tests'
]);
```

### Available UI Functions

| Function | Description |
|----------|-------------|
| `showBanner()` | Display full ASCII banner |
| `showCompactBanner()` | Display compact banner |
| `sectionHeader(title)` | Display section header |
| `success(msg, details?)` | Success message |
| `error(msg, details?)` | Error message |
| `warning(msg, details?)` | Warning message |
| `info(msg, details?)` | Info message |
| `step(n, total, msg)` | Progress step |
| `table(headers, rows)` | Display table |
| `divider()` | Horizontal divider |
| `nextSteps(steps)` | Next steps list |
| `keyValue(key, value)` | Key-value pair |
| `highlight(text)` | Highlighted text |
| `filePath(path)` | Formatted file path |
| `timestamp(date)` | Formatted timestamp |

---

See also:
- [Architecture Overview](architecture.md)
- [CHANGELOG-UI-IMPROVEMENTS.md](CHANGELOG-UI-IMPROVEMENTS.md)