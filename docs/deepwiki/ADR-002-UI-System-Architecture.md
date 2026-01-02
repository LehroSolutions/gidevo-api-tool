# ADR-002: UI System Architecture

**Status:** Superseded by ADR-003  
**Date:** November 25, 2025  
**Decision Makers:** Development Team

> **Note:** This ADR has been superseded by [ADR-003: Avant-Garde UI Overhaul](ADR-003-Avant-Garde-UI-Overhaul.md) (December 2025) which implements a premium "Neural/Deep Space" design language.

---

## Context

The CLI tool lacked consistent visual feedback and had several UX issues:

1. **Inconsistent output formatting** - Mix of `console.log`, `chalk`, and `logger` calls
2. **No branding** - No visual identity for the tool
3. **Poor error messages** - Errors were not clearly distinguished
4. **Missing helpful guidance** - No "next steps" or tips for users
5. **Corrupted templates** - Handlebars templates had malformed content
6. **Private property access** - `whoamiCommand` was accessing AuthService internals

---

## Decision

Create a centralized UI utility module (`src/cli/utils/ui.ts`) that provides:

1. **Consistent message types** - success, error, warning, info with distinct symbols
2. **Branding elements** - ASCII art banner and compact header
3. **Structured output** - tables, progress steps, dividers
4. **Color theming** - consistent brand colors throughout
5. **Helpful sections** - "Next Steps" suggestions after operations
6. **Exportable utilities** - Plugin developers can use the same UI

### Design Principles

1. **Separation of Concerns** - UI logic separated from business logic
2. **Consistency** - All commands use the same output patterns
3. **Accessibility** - Can be disabled via flags (--no-color, --quiet)
4. **Extensibility** - Easy to add new UI components
5. **Testability** - Console output can be mocked in tests

---

## Implementation

### UI Module Structure

```typescript
// src/cli/utils/ui.ts
export const ui = {
  showBanner,        // Full ASCII banner
  showCompactBanner, // Compact header
  success,           // ✓ Success message
  error,             // ✗ Error message
  warning,           // ⚠ Warning message
  info,              // ℹ Info message
  step,              // [n/total] Progress step
  table,             // Formatted table
  divider,           // Horizontal divider
  nextSteps,         // 📋 Next Steps section
  keyValue,          // Key: Value pair
  sectionHeader,     // ▸ Section Header
  highlight,         // Highlighted text
  filePath,          // Cyan file path
  timestamp,         // Formatted date/time
};
```

### Original Color Theme (November 2025)

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | Blue | #3B82F6 |
| Success | Green | #10B981 |
| Accent | Amber | #F59E0B |

### Updated Color Theme (December 2025 - ADR-003)

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | Violet | #8B5CF6 |
| Secondary | Cyan | #06B6D4 |
| Accent | Pink | #EC4899 |

---

## Alternatives Considered

### 1. Use existing CLI framework UI (e.g., Ink)
- **Pros:** Rich interactive UI, React-like components
- **Cons:** Heavy dependency, overkill for our needs, learning curve

### 2. Keep using chalk directly
- **Pros:** Simple, already in use
- **Cons:** No consistency, scattered styling logic

### 3. Use boxen/cli-table packages
- **Pros:** Pre-built components
- **Cons:** Additional dependencies, less control over styling

### Chosen Approach
Build a lightweight, custom UI module using only chalk (already a dependency). This provides full control, minimal dependencies, and consistent branding.

---

## Consequences

### Positive

1. **Consistent UX** - All commands now look and feel the same
2. **Professional appearance** - Branded output improves tool perception
3. **Better error handling** - Clear, actionable error messages
4. **Helpful guidance** - Next steps help users know what to do
5. **Plugin support** - Plugins can use the same UI utilities
6. **Testable** - Easy to mock console output in tests

### Negative

1. **Maintenance** - Custom UI code needs ongoing maintenance
2. **Learning curve** - Contributors need to learn UI conventions
3. **Test updates** - Existing tests needed string matching updates

### Neutral

1. **Output verbosity** - More output than before (mitigated by --quiet)
2. **Breaking change potential** - Future UI changes may affect tests

---

## Related Decisions

- [ADR-001: Plugin Architecture](ADR-001-Plugin-Architecture.md) - UI exported for plugins
- **[ADR-003: Avant-Garde UI Overhaul](ADR-003-Avant-Garde-UI-Overhaul.md)** - Supersedes this ADR

---

## References

- [CHANGELOG-UI-IMPROVEMENTS.md](CHANGELOG-UI-IMPROVEMENTS.md)
- [CLI UX Documentation](cli-ux.md)
