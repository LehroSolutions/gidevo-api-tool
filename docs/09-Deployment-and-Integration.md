# 09-Deployment-and-Integration.md

# Deployment & Integration

## 1. Containerization

### Docker
```Dockerfile
# Base image
FROM python:3.11-slim AS builder
WORKDIR /app

# Install dependencies
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev

# Copy source
COPY . .

# Build SDKs
RUN gidevo-api-tool generate --spec openapi.yaml --lang python --out sdk/python

# Final stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app sdk/python dist/
ENTRYPOINT ["python", "dist/your_app.py"]
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-integration
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-integration
  template:
    metadata:
      labels:
        app: api-integration
    spec:
      containers:
      - name: integration
        image: company/gidevo-api-tool:latest
        env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: apiKey
        ports:
        - containerPort: 80
```

## 2. Serverless Deployment
- **AWS Lambda**: package SDK and handler in zip; use Layers for common code.
- **Azure Functions**: use `func` CLI for Python/TS triggers.
- **GCP Cloud Functions**: deploy via `gcloud functions deploy`.

## 3. Platform-Specific Tips
- **Spring Boot (Java)**: include generated Java SDK jar as dependency.
- **.NET**: add NuGet package for SDK.
- **Mobile (iOS/Android)**: consume REST via generated TS wrapper or native client.

## 4. SDK Integration Examples

### Embedding in a Python Flask App
```python
from flask import Flask
from sdk.python import ApiClient, Configuration

app = Flask(__name__)
config = Configuration(base_url="https://api.example.com", api_key="XYZ")
client = ApiClient(config)

@app.route('/data')
def data():
    return client.get_resources()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
```

### Embedding in a Next.js App
```ts
// pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiClient, Configuration } from 'sdk/ts'

const config = new Configuration({ baseUrl: process.env.API_URL!, apiKey: process.env.API_KEY! });
const client = new ApiClient(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await client.getResources();
  res.status(200).json(data);
}
```

## 5. CI/CD Rollouts & Canary Deployments
- Use feature flags and gradual rollout strategies.
- Implement blue/green or canary deployments in Kubernetes.

## 6. Observability & Logging
- Integrate structured logging (JSON) and propagate trace IDs.
- Export metrics via Prometheus exporters.
- Configure dashboards (Grafana) and alerts.

## 7. Troubleshooting
- **Common Issues**:
  - Spec mismatch: regenerate client after spec changes.
  - Auth failures: verify secrets and token scopes.
  - Network errors: check DNS, proxies, CORS.
- **Debugging Tools**:
  - HTTP clients (Postman, curl).
  - SDK verbose logging (`--log-level debug`).
  - Container logs (`kubectl logs`).

---
*Next:* Draft `10-Monitoring-and-Logging.md` covering telemetry, dashboards, log aggregation, and alerting.  
