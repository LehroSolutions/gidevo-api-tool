# 06-Security-and-Authentication.md

# Security & Authentication

## 1. Core Principles
- **Zero Trust**: verify every request.
- **Least Privilege**: grant minimal access.
- **Defense in Depth**: layered controls.
- **Auditability**: record critical events.

## 2. Authentication Flows

### API Key
- Simple header or query param.
- Rotate keys regularly.
- Suitable for service-to-service.

### OAuth2
| Flow                  | Use Case                         |
|-----------------------|----------------------------------|
| Client Credentials    | Backend-to-backend               |
| Authorization Code    | User login (SSO)                 |
| Refresh Token         | Long-lived sessions              |

- Use PKCE for public clients.
- Validate scopes in token.

### JWT
- Bearer tokens signed with RS256 or HS256.
- Verify signature, expiration, issuer.
- Include `sub`, `aud`, `iat`, `exp`, and custom claims.

## 3. Role-Based Access Control (RBAC)
- Define roles and permissions in a central policy file.
- Enforce via middleware/interceptors.
- Example YAML:
  ```yaml
  roles:
    ADMIN:
      - users:create
      - users:delete
    USER:
      - data:read
      - data:write
  ```

## 4. Secure Data Handling
- **Input Validation**: strict schemas (Pydantic, Joi).
- **Output Encoding**: escape user content.
- **Encryption**:
  - TLS/TLS1.2+ for transport.
  - At rest via database encryption.
- **Secrets Management**:
  - Integrate HashiCorp Vault, AWS Secrets Manager.
  - Do not hardcode credentials.

## 5. Rate Limiting & Throttling
- Per-key or per-user limits.
- Token bucket or leaky bucket algorithms.
- Pluggable in core runtime.
- Example config:
  ```yaml
  rateLimit:
    window: 60s
    maxRequests: 1000
  ```

## 6. CORS & CSRF
- **CORS**: whitelist origins, allow `GET,POST,PUT,DELETE`.
- **CSRF**: use same-site cookies or token in header.

## 7. Audit Logging & Monitoring
- Record auth events (login, token refresh, failures).
- Correlate request IDs across services.
- Stream logs to SIEM (Splunk, ELK).

## 8. Best Practices
- Enforce TLS in HTTP clients and CLI.
- Rotate keys and certificates regularly.
- Pen-test and scan dependencies.
- Provide security patches on SLA.
- Document deprecation of auth schemes.

## 9. Sample Code

### Python (FastAPI Middleware)
```python
# auth_middleware.py
from fastapi import Request, HTTPException
from sdk.python import JwtVerifier

async def auth_middleware(request: Request, call_next):
    token = request.headers.get("Authorization", "").split(" ")[1]
    try:
        claims = JwtVerifier.verify(token)
        request.state.user = claims
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    response = await call_next(request)
    return response
```  

### TypeScript (NestJS Guard)
```ts
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization']?.split(' ')[1];
    if (!auth) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(auth);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
```  

## 10. Configuration Example

`configs/auth.yaml`:
```yaml
auth:
  type: oauth2
  oauth2:
    token_url: https://auth.example.com/token
    client_id: ${CLIENT_ID}
    client_secret: ${CLIENT_SECRET}
  jwt:
    public_key_path: ./certs/public.pem
    algorithm: RS256
```

---
*Next:* Draft `07-Testing-and-QA.md` covering unit, integration, and contract tests.   
