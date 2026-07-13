# ADR-004: Developer-Clear Agentic CLI

**Status:** Accepted  
**Date:** May 6, 2026  
**Decision Makers:** Development Team

## Context

The v0.1.5 CLI used a distinctive "avant-garde" vocabulary. It was memorable, but public OSS users need commands and errors that are easy to scan, search, and automate.

Node 24 is now Active LTS, and Node 26.0.0 was released as Current on May 5, 2026. v0.2 uses this as the modernization point for an ESM-first CLI.

## Decision

For v0.2:

- Use Node 24+ and publish ESM-first output.
- Keep the GIDEVO brand, but prefer direct CLI wording.
- Add `doctor` for read-only health checks.
- Add `workflow` for validate-then-generate runs.
- Support `--json` on agentic commands.
- Keep existing command aliases for compatibility.

## Consequences

- Node 18 and Node 20 are no longer supported.
- CommonJS programmatic usage is no longer the primary interface.
- CLI output snapshots and docs move from "synthesis/neural" terminology to developer-clear wording.
- Automation becomes easier because `doctor` and `workflow` expose JSON reports.

## References

- Node.js Release Working Group schedule: Node 24 Active LTS, Node 26 Current.
- Node.js 26.0.0 release post, published May 5, 2026.
