# ADR-003: Avant-Garde UI Overhaul (December 2025)

**Status:** Accepted  
**Date:** December 23, 2025  
**Decision Makers:** Development Team

---

## Context

While the previous UI system (November 2025) provided consistent output, it used conventional developer terminology that did not differentiate the tool in the market. User feedback and competitive analysis revealed:

1. **Generic Branding** - Standard "success/error" messaging similar to every other CLI
2. **Forgettable Experience** - No distinctive visual or linguistic identity
3. **Missed Adoption Opportunity** - The current software climate favors tools that feel premium and futuristic
4. **Commodity Perception** - Users perceived the tool as "just another CLI"

---

## Decision

Implement an "Avant-Garde" design language that transforms the CLI into a premium, futuristic experience:

### Visual Identity

| Element | Old | New |
|---------|-----|-----|
| Primary Color | Blue (#3B82F6) | Violet (#8B5CF6) |
| Secondary Color | Green (#10B981) | Cyan (#06B6D4) |
| Accent Color | Amber (#F59E0B) | Pink (#EC4899) |
| Banner Style | ASCII Art Box | Minimalist Spaced Typography |
| Table Headers | Bold, Title Case | UPPERCASE, Dim |

### Linguistic Transformation

All terminology updated to convey technical sophistication:

| Concept | Old Term | New Term |
|---------|----------|----------|
| Code Generation | "Generate" | "Synthesis" |
| Validation | "Validate" | "Schema Integrity Verification" |
| Authentication | "Login/Logout" | "Secure Context / Session Termination" |
| Plugins | "Plugins" | "Extensions" |
| Configuration | "Config" | "Environment Manifest" |
| Errors | "Errors" | "Anomalies" |
| Files | "Files" | "Artifacts" |
| Directory | "Directory" | "Workspace" / "Vault" |

### Banner Evolution

**Before:**
```
╔════════════════════════════════════════════════════════════╗
║   ██████╗ ██╗██████╗ ███████╗██╗   ██╗ ██████╗              ║
...
╚════════════════════════════════════════════════════════════╝
```

**After:**
```
  G I D E V O
  ──────────────────────
  API Integration Engine
  v0.1.5
```

---

## Implementation

### Modified Files

| File | Changes |
|------|---------|
| `src/cli/utils/ui.ts` | New THEME object, updated all functions |
| `src/cli/utils/interactive.ts` | Themed prompts, boxed summaries |
| `src/cli/commands/init.ts` | "NEURAL ARCHITECTURE", "Synthesis" |
| `src/cli/commands/generate.ts` | "SDK SYNTHESIS PROTOCOL" |
| `src/cli/commands/validate.ts` | "SCHEMA INTEGRITY VERIFICATION" |
| `src/cli/commands/login.ts` | "SECURE CONTEXT ESTABLISHMENT" |
| `src/cli/commands/logout.ts` | "SESSION TERMINATION" |
| `src/cli/commands/whoami.ts` | "IDENTITY CONTEXT" |
| `src/cli/commands/plugin.ts` | "EXTENSION RUNTIME" |
| `src/cli/commands/config.ts` | "ENVIRONMENT CONFIGURATION" |

### Theme Configuration

```typescript
const THEME = {
  primary: '#8B5CF6',    // Violet
  secondary: '#06B6D4',  // Cyan
  accent: '#EC4899',     // Pink
  dim: '#64748B',        // Slate
  bg: '#1E293B',         // Dark Slate
  success: '#10B981',    // Emerald
  error: '#EF4444',      // Red
  warning: '#F59E0B',    // Amber
};
```

---

## Alternatives Considered

### 1. Keep Standard Terminology
- **Pros:** Familiar to developers
- **Cons:** No differentiation, forgettable

### 2. Fully Abstract (e.g., "Weave", "Manifest", "Invoke")
- **Pros:** Maximum uniqueness
- **Cons:** Too confusing, high learning curve

### 3. Hybrid Approach (Chosen)
- **Pros:** Familiar enough to understand, distinctive enough to remember
- **Cons:** Some users may need adjustment period

---

## Consequences

### Positive

1. **Brand Differentiation** - Tool now has unique identity
2. **Premium Perception** - Futuristic language elevates perceived value
3. **Memorable Experience** - Users remember "Synthesis" over "generate"
4. **Market Positioning** - Stands out in crowded CLI landscape
5. **Consistency** - All commands share unified voice

### Negative

1. **Learning Curve** - New terminology requires adjustment
2. **Documentation Updates** - All docs need revision
3. **Test Updates** - String matching in tests needs updating

### Neutral

1. **Polarizing** - Some users love it, some prefer traditional
2. **Searchability** - "Synthesis" less Google-able than "generate"

---

## Migration Notes

- No breaking changes to CLI flags or options
- Output formatting changed but structure preserved
- All existing workflows continue to function

---

## Related Decisions

- [ADR-002: UI System Architecture](ADR-002-UI-System-Architecture.md) - Original UI system
- [CHANGELOG-UI-IMPROVEMENTS.md](CHANGELOG-UI-IMPROVEMENTS.md) - Previous UI updates

---

## Appendix: Quick Reference

### Command Section Headers

| Command | Section Header |
|---------|----------------|
| init | INITIALIZING NEURAL ARCHITECTURE |
| generate | SDK SYNTHESIS PROTOCOL |
| validate | SCHEMA INTEGRITY VERIFICATION |
| login | SECURE CONTEXT ESTABLISHMENT |
| logout | SESSION TERMINATION |
| whoami | IDENTITY CONTEXT |
| plugin | EXTENSION RUNTIME |
| config | ENVIRONMENT CONFIGURATION |

### Message Patterns

```
  ✔ SUCCESS
  {message}
  
  ✖ ERROR
  {message}
  
  ! WARNING
  {message}
  
  ℹ INFO
  {message}
```
