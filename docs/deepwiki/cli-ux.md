# CLI UX & Accessibility

Focus on clear feedback, accessibility, and CI friendliness.

---

## UI System (December 2025 - Avant-Garde)

The CLI uses a comprehensive UI system (`src/cli/utils/ui.ts`) providing consistent, premium output with a futuristic design language.

### Design Philosophy: Intentional Minimalism

The UI follows these principles:
- **Reduction over decoration** - Every element serves a purpose
- **Asymmetric elegance** - Modern, non-templated layouts
- **Premium language** - Technical sophistication in terminology

### Banner Display

```
  G I D E V O
  ──────────────────────
  API Integration Engine
  v0.1.5
```

### Compact Banner (for subcommands)
```
  ● GIDEVO API Tool
```

---

## Color Theme (Avant-Garde Palette)

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary (Core Identity) | Violet | #8B5CF6 |
| Secondary (Actions) | Cyan | #06B6D4 |
| Accent (Highlights) | Pink | #EC4899 |
| Success | Emerald | #10B981 |
| Error | Red | #EF4444 |
| Warning | Amber | #F59E0B |
| Dim/Muted | Slate | #64748B |
| Background | Dark Slate | #1E293B |

---

## Global Flags

| Flag | Description |
|------|-------------|
| `--no-spinner` | Disable spinners (for CI or screen readers) |
| `--no-color` | Disable ANSI color output |
| `--no-plugins` | Disable extension loading |
| `-q, --quiet` | Suppress banner and non-essential output |
| `-i, --interactive` | Run in guided wizard mode |

---

## Command Aliases

| Full Command | Alias |
|--------------|-------|
| `init` | `i` |
| `generate` | `gen` |
| `validate` | `val` |
| `plugin` | `p` |

---

## Message Types (Avant-Garde Style)

### Success Messages
```
  ✔ SUCCESS
  Operation message here.
```

### Error Messages
```
  ✖ ERROR
  Error description here.
```

### Warning Messages
```
  ! WARNING
  Warning message here.
```

### Info Messages
```
  ℹ INFO
  Information here.
```

---

## Progress Indicators

### Step Progress (Modern Format)
```
  [01/04] Creating directories...
  [02/04] Generating package.json...
  [03/04] Creating spec template...
  [04/04] Creating documentation...
```

### Configuration Tables
```
  PARAMETER           VALUE
  Source Document     /path/to/api.yaml
  Verification Mode   STRICT
  Output Artifact     ./generated
```

---

## Section Headers

Section headers use UPPERCASE with `::` prefix:

```
  :: SCHEMA INTEGRITY VERIFICATION

  :: SDK SYNTHESIS PROTOCOL

  :: IDENTITY CONTEXT
```

---

## Next Steps Sections

After command completion, actionable guidance:

```
  READY TO BUILD

  1. cd my-api
  2. Define your schema in specs/
  3. Run synthesis: npm run generate
```

---

## Terminology Mapping

The Avant-Garde design uses distinctive terminology:

| Concept | Avant-Garde Term |
|---------|------------------|
| Generate code | Synthesis |
| Validate specs | Schema Integrity Verification |
| Login | Secure Context Establishment |
| Logout | Session Termination |
| Plugins | Extensions |
| Configuration | Environment Manifest |
| Errors | Anomalies |
| Files | Artifacts |
| Directories | Workspaces / Vaults |

---

## Spinners & Feedback

- Visual spinner via `ora` shows progress for long operations
- Spinner wrapper (`createSpinner`) ensures fallback to no-op in non-TTY or CI
- Success/failure uses clear Unicode icons (✔, ✖, !, ℹ)

---

## Accessibility Considerations

- `--no-spinner` flag disables animated spinners
- `--no-color` flag disables all ANSI colors
- `--quiet` flag reduces output to essentials only
- Clear text alternatives via `console.log` messages
- All dynamic output can be disabled for screen readers
- Exit codes properly set (0 for success, 1 for error)

---

## Using UI Utilities in Extensions

Extension developers can import and use the UI system:

```typescript
import { ui } from 'gidevo-api-tool';

// In your extension
ui.showCompactBanner();
ui.sectionHeader('MY EXTENSION');
ui.success('Extension Complete', 'Processed 10 files');
ui.nextSteps([
  'Review the output',
  'Run verification tests'
]);

// Access theme colors directly
console.log(chalk.hex(ui.theme.primary)('Custom colored text'));
```

### Available UI Functions

| Function | Description |
|----------|-------------|
| `showBanner()` | Display minimalist banner |
| `showCompactBanner()` | Display compact banner |
| `sectionHeader(title)` | Display UPPERCASE section header |
| `success(msg, details?)` | Success message with ✔ |
| `error(msg, details?)` | Error message with ✖ |
| `warning(msg, details?)` | Warning message with ! |
| `info(msg, details?)` | Info message with ℹ |
| `step(n, total, msg)` | Progress step [01/04] |
| `table(headers, rows)` | Display modern table |
| `divider()` | Subtle horizontal divider |
| `nextSteps(steps)` | READY TO BUILD list |
| `list(items, title?)` | Arrow-prefixed list |
| `keyValue(key, value)` | Key: Value pair |
| `box(content, opts)` | Bordered content box |
| `highlight(text)` | Accent-colored text |
| `filePath(path)` | Underlined dim path |
| `timestamp(date)` | ISO date format |
| `theme` | Direct access to color palette |

---

See also:
- [Architecture Overview](architecture.md)
- [ADR-003: Avant-Garde UI Overhaul](ADR-003-Avant-Garde-UI-Overhaul.md)
- [CHANGELOG-UI-IMPROVEMENTS.md](CHANGELOG-UI-IMPROVEMENTS.md)