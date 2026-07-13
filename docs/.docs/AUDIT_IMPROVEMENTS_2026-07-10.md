        # Audit & Improvements — 2026-07-10

        Product: **GIDEVO API Tool**

        ## Audit findings addressed
        - Medium: nested example packages without workspaces
- Medium: residual npm run usage in scripts
- Example demo token looked secret-like

        ## Improvements applied
        - Declared workspaces for examples/*
- Normalized packageManager/engines and install scripts
- Example token now reads GIDEVO_API_TOKEN env with demo fallback
- Added INSTALL.md

        ## Install verification
        - JS/TS packages: run `bun install` from the directory containing `package.json` (repo root for workspace packages).
        - Python packages: use venv + pip (`INSTALL.md`).

        ## Related
        - [How to Use](./how-to-use.md)
        - [Security](./security.md)
        - [ADR-0003 Package Manager](./adr-0003-package-manager-bun.md)
