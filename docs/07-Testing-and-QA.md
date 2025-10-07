# 07-Testing-and-QA.md

# Testing & QA

## 1. Importance of Testing
- Ensure API contract stability and reliability.
- Prevent regressions in generated SDKs.
- Build confidence for enterprise adoption.

## 2. Unit Testing
- **Purpose**: validate individual functions/modules.
- **Python**: pytest + pytest-mock
- **TypeScript**: Jest + ts-jest

### Best Practices
- Isolate business logic; mock external calls.
- Use fixtures for reusable setups.
- Aim for >70% coverage, but prioritize critical paths.

### Examples
```python
# test_client.py
import pytest
from sdk.python.client import ApiClient

class DummyResponse:
    status_code = 200
    json = lambda self: {"data": []}

@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr("requests.get", lambda url: DummyResponse())
    return ApiClient(base_url="https://api.test")

def test_get_resources(client):
    result = client.get_resources()
    assert isinstance(result, list)
```
```ts
// client.spec.ts
import { ApiClient, Configuration } from "sdk/ts";
import axios from "axios";

jest.mock("axios");
const mocked = axios as jest.Mocked<typeof axios>;

test("getResources returns array", async () => {
  mocked.get.mockResolvedValue({ data: [] });
  const client = new ApiClient(new Configuration({ baseUrl: "", apiKey: "" }));
  const res = await client.getResources();
  expect(Array.isArray(res)).toBe(true);
});
```

## 3. Integration Testing
- **Purpose**: test end-to-end interactions with a running service.
- Spin up test instance (Docker compose or test server).
- Validate full request/response cycles.

### Tools
- **Python**: pytest + httpx + TestClient (FastAPI)
- **TypeScript**: Jest + SuperTest

### Example
```ts
// integration.spec.ts
import request from "supertest";
import { app } from "../src/server"; // Express/Nest

describe("GET /resources", () => {
  it("should return 200 and JSON", async () => {
    const res = await request(app).get("/resources");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

## 4. Contract Testing
- **Purpose**: ensure client and server adhere to shared spec.
- Validate generated SDK against OpenAPI/GraphQL.
- Use Pact or Swagger-Contract-Tester.

### Example (Pact)
```js
const { Pact } = require('@pact-foundation/pact');
// define pact tests between consumer (SDK) and provider
```

## 5. Continuous Integration
- Integrate tests into CI pipeline.
- Fail builds on test failures or coverage drop.
- Example (GitHub Actions):
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python & Node
        run: |
          python -m pip install pytest coverage
          npm install
      - name: Run Python tests
        run: pytest --cov=src
      - name: Run TS tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 6. Code Coverage
- Aim for high coverage on critical modules.
- Use coverage reports to identify gaps.
- Configure threshold rules to enforce quality.

## 7. QA & Automation
- Incorporate linting and spec validation (Spectral, GraphQL lint).
- Perform security scans (Snyk, Bandit).
- Automate release gating on test & scan success.

---
*Next:* Draft `08-Packaging-and-Distribution.md` covering CI/CD pipelines, versioning, registry publishing, and release notes.
