# Security

**Counterparts:** [`security.html`](security.html) · [`security.json`](security.json)

- **Section:** Security
- **Audience:** Security reviewers, maintainers, and contributors
- **Use when:** Handling credentials, sensitive data, authenticated actions, or a security review.
- **Status:** Current
- **Last reviewed:** 2026-07-13

## Purpose

Capture the public security boundary for GIDEVO API Tool and link secure changes to verifiable behavior.

## On this page

- [Current safeguards](#current-safeguards)
- [Contributor rules](#contributor-rules)
- [Verification](#verification)

## Current safeguards

- Keep specification and output paths within the project boundary unless an explicit unsafe override is justified.
- Use JSON configuration only; JavaScript configuration is rejected to avoid code execution.

## Contributor rules

- Never commit real credentials, populated runtime data, access tokens, or private production logs.
- Validate untrusted input at the API or import boundary.
- Document security-relevant decisions in an ADR or evidence log when trade-offs are durable.

## Verification

- Run targeted negative-path tests where the product provides them.
- Confirm public examples use synthetic data and safe defaults.

## Related guides

- [Architecture](architecture.md)
- [Operations](operations.md)
- [Quality](quality.md)
