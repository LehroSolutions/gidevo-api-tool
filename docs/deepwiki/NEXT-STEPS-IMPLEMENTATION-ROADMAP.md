# NEXT STEPS: Implementation Roadmap

This document captures the remaining work, priorities, and acceptance criteria for the remaining improvements we planned and partially implemented.

---

## ✅ Status Summary (Updated: November 25, 2025)

| Component | Status | Files |
|-----------|--------|-------|
| Build System | ✅ Complete | Root script delegates to subproject |
| Generator Refactor | ✅ Complete | `src/core/generator.ts`, `src/core/strategies/*` |
| Validation (AJV) | ✅ Complete | `src/core/validator.ts` |
| Spinner / UX | ✅ Complete | `src/cli/utils/spinner.ts` |
| Logger | ✅ Complete | `src/core/logger.ts` |
| Snapshot Tests | ✅ Complete | `tests/generateCommand.test.ts` |
| Templating Engine | ✅ Complete | `src/templates/*`, strategies |
| Plugin System | ✅ Complete | `src/cli/index.ts`, `src/plugins/plugin.ts` |
| CI / Lint / Tests | ✅ Complete | `.github/workflows/*` |
| **UI System** | ✅ **NEW** | `src/cli/utils/ui.ts` |
| **Template Fixes** | ✅ **NEW** | All `.hbs` templates rewritten |
| **Auth Improvements** | ✅ **NEW** | `src/core/auth.ts` enhanced |
| **Command Enhancements** | ✅ **NEW** | All commands improved |

---

## Recently Completed (November 2025)

### 🎨 UI System Overhaul
- Created comprehensive UI utilities (`src/cli/utils/ui.ts`)
- ASCII art banner with branding
- Consistent success/error/warning/info messages
- Tables, progress steps, dividers
- Next steps suggestions
- Color theming with brand colors

### 🔧 Bug Fixes
- Fixed corrupted Handlebars templates (TypeScript & Python)
- Fixed AuthService private property access issue
- Added proper error exit codes (process.exit(1))
- Added input validation for all commands

### 📝 Command Enhancements
- Added command aliases (gen, val, i, p)
- Extended help text with examples
- Quiet mode (--quiet flag)
- Progress indicators and duration tracking
- Configuration display tables

### 🧪 Test Updates
- All 29 tests passing
- Updated snapshots for new template output
- Added exit code testing for error cases

See `CHANGELOG-UI-IMPROVEMENTS.md` for complete details.

---

## High Priority (Blocker / High Value)

1) Templating Engine for Code Generation (Completed)
- Rationale: Keep presentation (code templates) separate from logic. Avoid brittle inline string templates.
- Implementation:
  - Added `templates/` directory with Handlebars templates.
  - Updated `TypeScriptStrategy` and `PythonStrategy` to use Handlebars.
  - Added build script to copy templates to dist.

2) Plugin System: Commands & Secure Loading (Completed)
- Rationale: Allow plugins to register `commander` commands and run in isolated contexts; avoid arbitrary side-effects.
- Implementation:
  - Updated plugin API to accept `program: Command` in `initialize`.
  - Added `--no-plugins` flag to disable plugin execution.
  - Updated existing plugins to match new interface.

3) CI / Lint / Tests Pipeline (Coverage and Snapshot Automation) (Completed)
- Rationale: Ensure deterministic builds and CI-friendly logging and snapshot updates.
- Implementation:
  - Added `.github/workflows/ci.yml` for build, test, lint.
  - Added `.github/workflows/update-snapshots.yml` for manual snapshot updates.
  - Verified linting and tests pass.

---

## Medium Priority (Quality & Maintainability)

4) Improve validation to use full OpenAPI Schema (Completed)
- Rationale: Our current minimal schema via AJV is fine for surface validation; use official schemas for complete coverage.
- Implementation:
  - Integrated `openapi-schema-validator`.
  - Added `--strict` flag to `validate` command.
  - Updated `Validator` class to support strict mode.

5) Add Telemetry & Error Reporting Hooks (Completed)
- Rationale: Improve debugging and metrics across CLI usage (errors per command, success rates).
- Implementation:
  - Created `TelemetryService` with `ConsoleTelemetryProvider`.
  - Added telemetry tracking to `init`, `generate`, and `validate` commands.
  - Supports `TELEMETRY_DEBUG` env var.

6) Observability Enhancements (Completed)
- Rationale: Structured logs are already implemented; add metrics and trace IDs.
- Implementation:
  - Added `traceId` generation in CLI entry point using `uuid`.
  - Updated `Logger` to include `traceId` in logs.
  - Propagated `traceId` to telemetry events.

---

## Low Priority (Nice to Have / Future)

7) Add language-specific advanced features
- e.g., TypeScript: include typed models, client classes per path
- e.g., Python: add typing for responses using pydantic models
- Acceptance Criteria: Unit tests for sample spec outputs.
- Estimated Time: 1-3 days

8) E2E / Example Projects & Sample Plugins
- Rationale: Provide example plugin and template to onboard community contributors.
- Implementation: Add a `examples/` folder that shows `generate` for both TS and Python and a sample plugin.
- Estimated Time: 1-2 days

9) Security Review & Secrets Handling
- Rationale: The CLI may store tokens (login), ensure secrets are stored securely.
- Implementation: Add keychain/higher security storage support for tokens (optional adapter per platform), or use `keytar`.
- Estimated Time: 1 day

10) Interactive Mode
- Rationale: Provide guided wizard for new users
- Implementation: Add `gidevo-api-tool --interactive` that prompts for all options
- Estimated Time: 1-2 days

11) Configuration File Support
- Rationale: Allow project-level configuration
- Implementation: Support `.gidevorc.json` or `gidevo.config.js` for default settings
- Estimated Time: 1 day

---

## Tasks & Owners

### Completed ✅
- [x] Templating migration (Strategy Pattern + Handlebars)
- [x] Plugin API changes (Commander integration)
- [x] CI pipeline and testing hardening
- [x] Strict validation modes
- [x] Observability & Telemetry
- [x] UI System overhaul
- [x] Template bug fixes
- [x] Auth service improvements

### Remaining 🔲
- [ ] Sample projects & examples (Owner: Docs/Examples)
- [ ] Security review (Owner: Security team)
- [ ] Advanced language features (Owner: Generator team)
- [ ] Interactive mode (Owner: CLI team)
- [ ] Configuration file support (Owner: Core team)

---

## Acceptance Criteria and PR Guidelines
For each major change:
- Add tests covering happy path and 3 edge cases
- Add snapshot tests where output changes
- Update `docs/deepwiki` with an ADR for the design decision
- Ensure all lint warnings are resolved
- Ensure `npm run build` works from `D:\gidevo-api-tool-main` root (with root script) and from the subproject `gidevo-api-tool-main`

---

## Suggested Timeline (Rough)
- Week 1: Templating migration + Strategy updates, plugin API (MVP), snapshot tests
- Week 2: CI and lint stabilization, strict validator mode
- Week 3: Observability and telemetry, token storage improvements, sample plugin
- Week 4: Polishing, docs, examples, and community onboarding

---

## Notes & Links
- Current Implementation Files:
  - Generator Strategy: `src/core/generator.ts`, strategies folder
  - Validator: `src/core/validator.ts` (AJV + openapi-schema-validator)
  - Logger: `src/core/logger.ts` (enhanced with child loggers)
  - Spinner: `src/cli/utils/spinner.ts` (no-op and dynamic import safe)
  - **UI System: `src/cli/utils/ui.ts` (NEW - comprehensive UI utilities)**
  - CLI: `src/cli/index.ts` (plugin system, aliases, extended help)
  - Auth: `src/core/auth.ts` (enhanced with public methods)
- Templates:
  - TypeScript: `src/templates/typescript/client-rest.hbs`, `types.hbs`
  - Python: `src/templates/python/client.hbs`
- Example test: `tests/generateCommand.test.ts` (snapshot testing)
- Documentation:
  - `docs/deepwiki/CHANGELOG-UI-IMPROVEMENTS.md` - Latest changes
  - `docs/deepwiki/ADR-*.md` - Architecture decision records

---

## Project Health

| Metric | Status |
|--------|--------|
| Build | ✅ Passing |
| Tests | ✅ 29/29 Passing |
| Snapshots | ✅ 2/2 Passing |
| Lint | ✅ Clean |
| Coverage | 📊 Available via `npm run test:coverage` |

---

## Quick Start for Contributors

```bash
# Clone and install
git clone https://github.com/lehrosolutions/gidevo-api-tool.git
cd gidevo-api-tool-main

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Try the CLI
node dist/cli/index.js --help
node dist/cli/index.js validate tests/fixtures/api.yaml
node dist/cli/index.js generate -s tests/fixtures/api.yaml -l typescript -o ./output
```

---

If you'd like to contribute, please review the remaining tasks above and reach out to the respective owners. All PRs should follow the acceptance criteria outlined in this document.
