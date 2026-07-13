# 02-Architecture-and-Design.md

# Architecture & Design

## 1. API Style & Protocols
- **Primary Approach**: RESTful JSON-over-HTTP.
- **Alternate Modes**: GraphQL, gRPC for high-performance or real-time.
- **Specification**: OpenAPI 3.x for REST; SDL for GraphQL.

## 2. Modular Architecture

```
┌──────────────────────────────┐
│   CLI & Synthesis Layer      │
├────────────┬─────────────────┤
│  Extensions│   Templates     │
└────────────┴─────────────────┘
             ↓
┌──────────────────────────────┐
│     Core Runtime Engine      │
├──────────┬────────┬──────────┤
│ Transport│Security│  Cache   │
│  Layer   │ Layer  │  Layer   │
└──────────┴────────┴──────────┘
             ↓
┌──────────────────────────────┐
│    Language Bindings         │
├──────────────────────────────┤
│  Python  │   TypeScript      │
│  + Extensions for Java, Go…  │
└──────────────────────────────┘
```

- **CLI & Synthesis**: Scaffolds projects, synthesizes SDKs.
- **Core Runtime**: Handles HTTP transport, auth, retry, caching.
- **Language Bindings**: Thin layer per language to call core.

## 3. Extension Architecture
- Defined via standard interface (e.g., Node.js module, Python entry point).
- Auto-discovery of extensions in `plugins/` folder.
- Hooks for custom transports, auth schemes, or logging.

## 4. Data Modeling & Schemas
- Central definitions in OpenAPI/GraphQL.
- Shared type registry for code synthesis to derive idiomatic types.
- Support for custom type adapters (e.g., datetime formats).

## 5. Scalability & Performance
- Asynchronous/non-blocking transport (async/await).
- Connection pooling & HTTP2 multiplexing.
- Circuit breaker & bulkhead patterns.
- Pluggable cache (in-memory, Redis).

## 6. Extensibility Points
- **Custom Middleware**: request/response interceptors.
- **Event Hooks**: onError, onRetry, onSuccess.
- **Policy Engine**: rate-limit, quota at runtime via config.

## 7. Security Considerations
- Zero-trust by default: strict input validation.
- Pluggable auth: OAuth2, API Key, JWT.
- TLS enforcement, HSTS headers for CLI downloads.
- Secret management integration (Vault, AWS Secrets Manager).

## 8. UI/UX Architecture

v0.2 uses a developer-clear agentic CLI:

- `doctor` performs read-only project health checks.
- `workflow` validates a spec before generation.
- `--json` makes agentic command output machine-readable.
- Global `--quiet`, `--no-color`, and `--no-spinner` flags are centralized for CI and accessibility.

See [ADR-004: Developer-Clear Agentic CLI](deepwiki/ADR-004-Developer-Clear-Agentic-CLI.md) for details.
