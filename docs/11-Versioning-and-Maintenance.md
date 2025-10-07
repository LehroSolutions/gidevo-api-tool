# 11-Versioning-and-Maintenance.md

# Versioning & Maintenance

## 1. Semantic Versioning Policy
- Follow **MAJOR.MINOR.PATCH**:
  - **MAJOR**: breaking API changes
  - **MINOR**: new features, backward-compatible
  - **PATCH**: bug fixes, backward-compatible
- Enforce via CI (`semantic-release`, `poetry version`).
- Tag releases as `vMAJOR.MINOR.PATCH`.

## 2. Deprecation Strategy
- Mark deprecated endpoints or SDK methods in spec/docs:
  ```yaml
  deprecated: true
  description: |
    This endpoint will be removed in v3.0.0. Use `/new-resource` instead.
  ```
- Communicate removal timeline (e.g., 6 months).
- Provide alternative APIs or migration guides.

## 3. Long-Term Support (LTS)
- Define LTS versions for enterprise clients.
- Provide security patches and critical fixes for LTS branches.
- Publish LTS schedule in README or support portal.

## 4. Branch & Release Management
- **Main Branch**: latest stable; merges via PR with passing CI.
- **Develop Branch**: integration for new features; CI & preview.
- **Release Branches**: `release/x.y` for pre-production QA.
- **Hotfix Branches**: `hotfix/x.y.z` from `main` for critical patches.

## 5. Compatibility Guarantees
- Guarantee wire-level compatibility for patch and minor releases.
- Document breaking changes in MAJOR releases.
- Maintain a compatibility matrix mapping SDK versions to spec versions.

## 6. Upgrade Guides & Changelogs
- Maintain `CHANGELOG.md` per [Keep a Changelog](https://keepachangelog.com/) format.
- Provide migration sections for significant changes.
- Example:
  ```md
  ## [2.0.0] - 2025-09-01
  ### Removed
  - Legacy `/v1` endpoints removed.

  ### Migration
  - Update base URL from `/v1` to `/v2`.
  ```

## 7. Support Windows & SLAs
- Define support window for each release (e.g., 12 months).
- SLA targets: response time, patch turnaround.
- Publish support tiers: Community, Enterprise.

## 8. Maintenance Automation
- Automate dependency updates via bots (Dependabot).
- Schedule regular spec linting and codegen validation.
- Use branch protection rules to enforce policies.

---
*This completes the guide set. Let me know if you’d like adjustments or a summary.*
