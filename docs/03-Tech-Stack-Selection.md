# 03-Tech-Stack-Selection.md

# Tech-Stack Selection

## 1. Language Ecosystems

| Concern         | Python                                    | TypeScript                                |
|-----------------|-------------------------------------------|-------------------------------------------|
| Popular Runtimes| CPython, PyPy, CPython-embedded           | Node.js, Deno                              |
| Typing          | Dynamic; optional type hints (mypy)       | Static; built-in typings                   |
| Concurrency     | asyncio, threading, multiprocessing       | async/await (Node), web workers, Deno’s Tokio |
| Community       | Data, ML, scripting, infra                | Web frontends, full-stack, serverless       |

## 2. Frameworks & Libraries

### Python
- **Web/API**: FastAPI (async, OpenAPI auto-gen), Flask, Django REST Framework
- **CLI & Codegen**: Click, Typer
- **Testing**: pytest, hypothesis
- **Packaging**: setuptools, Poetry

### TypeScript
- **Web/API**: NestJS, Express (TS), Koa
- **CLI & Codegen**: Oclif, yargs
- **Testing**: Jest, Mocha/Chai
- **Bundling**: Rollup, Webpack, esbuild

## 3. Package Management & Distribution
- Python: PyPI distribution (`wheel`, `sdist`), versioning via Poetry or bump2version
- TypeScript: npm/Yarn/PNPM, scoped packages, semantic-release
- Multi-language SDK: Docker image, language-specific registries

## 4. Build & CI/CD Integration
- **CI Providers**: GitHub Actions, GitLab CI, Jenkins, CircleCI
- **Tasks**:
  - Linting (flake8, ESLint)
  - Type & schema validation (mypy, tsc)
  - Unit & integration tests
  - Codegen step (OpenAPI → SDK)
  - Packaging & publishing
- **Artifact Storage**: Artifactory, Nexus, private registries

## 5. Criteria for Stack Selection
1. **Performance Needs**: gRPC (high throughput), async frameworks
2. **Team Skillset**: existing Python vs TS expertise
3. **Ecosystem Requirements**: ML/data (Python), frontend integration (TS)
4. **Deployment Targets**: containers, serverless, on-prem
5. **Maintenance & Support**: maturity, community, security updates

## 6. Recommended Combos
- **API-first Web Service**: FastAPI + Poetry + GitHub Actions
- **Full-Stack Enterprise App**: NestJS + npm + GitLab CI
- **CLI-based Tooling**: Typer + Click + Oclif

---
*Next:* Draft `04-API-Specification.md` detailing spec formats and conventions.
