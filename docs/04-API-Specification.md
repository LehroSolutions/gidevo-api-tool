# 04-API-Specification.md

# API Specification

## 1. Purpose & Benefits
- Defines a clear contract between providers and consumers.
- Enables automated SDK generation, contract testing, and docs.
- Ensures consistency and reduces integration friction.

## 2. OpenAPI (REST) Conventions
### File Structure (OpenAPI 3.x)
```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /resource:
    get:
      summary: List resources
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Resource'
components:
  schemas:
    Resource:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
``` 

### Best Practices
- **Consistent Naming**: kebab-case for paths, camelCase for JSON properties.
- **Versioning**: embed in URL (`/v1`), avoid breaking changes.
- **Error Models**: standardize error responses with `components/schemas/Error`.
- **SecuritySchemes**: define under `components/securitySchemes` (OAuth2, API Key).
- **Use `$ref`**: reuse schemas, parameters, and responses.
- **Response Wrapping**: avoid deep nesting; prefer flat structures.
- **Deprecation**: mark endpoints with `deprecated: true` and communicate removal timeline.

## 3. GraphQL SDL Conventions
```graphql
# schema.graphql
"""Custom directive for auth"""
directive @auth(role: Role!) on FIELD_DEFINITION

enum Role { ADMIN, USER }

type Query {
  getUser(id: ID!): User @auth(role: USER)
}

type User {
  id: ID!
  name: String!
  email: String!
}
``` 
- **Naming**: PascalCase for types, camelCase for fields.
- **Directives**: use for auth, rate-limit, caching.
- **Modular Schemas**: split `type`, `query`, `mutation`, and `subscription` into separate files.
- **Versioning**: use namespacing or URI versioning in endpoint.

## 4. Versioning Strategy
- **Semantic Versioning**: MAJOR.MINOR.PATCH in `info.version` or header.
- **URL Versioning**: `/v1/resource`; avoid mixing.
- **Breaking Changes**: increment MAJOR, maintain compatibility.

## 5. Linting & Validation
- **Spectral**: enforce style guides and best practices for OpenAPI.
- **GraphQL Codegen Lint**: validate SDL against conventions.
- **Automated Checks**: integrate into CI to block non-compliant PRs.

## 6. Custom Extensions
- Use vendor extensions (`x-`) for metadata (e.g., `x-rate-limit`).
- Document extensions clearly in CLI and docs.

---
*Next:* Draft `05-Implementation.md` with scaffolding, project structure, and sample code snippets.
