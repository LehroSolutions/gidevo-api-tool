# 10-Monitoring-and-Logging.md

# Monitoring & Logging

## 1. Objectives
- Gain real-time insights into API performance.
- Detect anomalies and failures proactively.
- Correlate traces, metrics, and logs for root-cause analysis.

## 2. Telemetry

### Metrics
- Use Prometheus-compatible libraries:
  - Python: `prometheus_client`
  - TypeScript: `prom-client`
- Define:
  - Counters (e.g., `api_requests_total`)
  - Histograms/Summaries (e.g., `api_request_latency_seconds`)
  - Gauges (e.g., `in_flight_requests`)

### Distributed Tracing
- Adopt OpenTelemetry (OTel) for traces.
- Instrument incoming/outgoing calls and propagate context.
- Export to backends: Jaeger, Zipkin, Datadog.

## 3. Structured Logging
- Format logs as JSON for easy parsing.
- Include fields:
  - `timestamp`, `level`, `message`, `service`, `trace_id`, `span_id`.
- Use:
  - Python: `structlog` or built-in `logging` with JSON formatter.
  - TypeScript: `pino`, `winston`, or `bunyan`.
- Avoid logging sensitive data.

## 4. Dashboards & Visualization
- Store metrics in Prometheus, visualize with Grafana.
- Key dashboards:
  - API throughput and error rate.
  - Latency percentiles (p50, p95, p99).
  - Resource usage (CPU, memory).
- Manage versions of dashboards as code (Grafana JSON).

## 5. Alerting
- Configure Prometheus Alertmanager or native cloud alerts.
- Example rules:
  - `error_rate > 1% for 5m`
  - `request_latency_seconds_bucket{le="0.5"} < threshold`
- Notify via Slack, PagerDuty, email.

## 6. Log Aggregation
- Centralize logs with:
  - ELK stack (Filebeat → Logstash → Elasticsearch → Kibana)
  - Hosted services: Datadog, Splunk, Logflare.
- Tag logs with environment and service labels.

## 7. Configuration
- Expose metrics endpoint (`/metrics`) and tracer exporter settings.
- Sample `configs/monitoring.yaml`:
  ```yaml
  monitoring:
    metrics_port: 8000
    tracing:
      exporter: jaeger
      endpoint: http://jaeger:14250
  logging:
    level: INFO
    format: json
  ```

## 8. Sample Code

### Python (FastAPI)
```python
from prometheus_client import Counter, Histogram, start_http_server
from fastapi import FastAPI, Request
import logging, structlog

# Metrics
total_requests = Counter('api_requests_total', 'Total API requests', ['endpoint', 'method', 'status'])
latency = Histogram('api_request_latency_seconds', 'Request latency', ['endpoint'])

app = FastAPI()
start_http_server(8000)

@app.middleware('http')
async def metrics_middleware(request: Request, call_next):
    endpoint = request.url.path
    method = request.method
    with latency.labels(endpoint=endpoint).time():
        response = await call_next(request)
    total_requests.labels(endpoint=endpoint, method=method, status=response.status_code).inc()
    return response
```

### TypeScript (Express)
```ts
import express from 'express';
import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import pino from 'pino-http';

collectDefaultMetrics();
const totalRequests = new Counter({ name: 'api_requests_total', help: 'Total API requests', labelNames: ['method','endpoint','status'] });
const latency = new Histogram({ name: 'api_request_latency_seconds', help: 'Request latency', labelNames: ['endpoint'] });

const app = express();
app.use(pino());

app.use((req, res, next) => {
  const end = latency.labels(req.path).startTimer();
  res.on('finish', () => {
    totalRequests.labels(req.method, req.path, res.statusCode.toString()).inc();
    end();
  });
  next();
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(await registry.metrics());
});
``` 

---
*Next:* Draft `11-Versioning-and-Maintenance.md` covering semantic versioning policies, deprecation strategy, and long-term support.  
