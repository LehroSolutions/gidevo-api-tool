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

### Design System: Avant-Garde
The CLI implements the "Avant-Garde" design language:

```typescript
const THEME = {
  primary: '#8B5CF6',    // Violet
  secondary: '#06B6D4',  // Cyan
  accent: '#EC4899',     // Pink
  dim: '#64748B',        // Slate
  success: '#10B981',    // Emerald
  error: '#EF4444',      // Red
  warning: '#F59E0B',    // Amber
};
```

### Terminology Mapping
| Standard Term | Avant-Garde Term |
|--------------|------------------|
| Generate | Synthesis |
| Validate | Schema Integrity Verification |
| Plugin | Extension |
| Configuration | Environment Manifest |

See [ADR-003: Avant-Garde UI Overhaul](deepwiki/ADR-003-Avant-Garde-UI-Overhaul.md) for details.
