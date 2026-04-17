# Performance Test Suite — k6

Performance test suite written in **k6** with **JavaScript** that evaluates the behavior of the cypress-realworld-app API under different load levels. Scripts are organized modularly with shared configuration.

## Test Scenarios

### Load Test (`scripts/load-test.js`)

Simulates a normal load scenario to validate that the API responds within acceptable thresholds under typical usage.

| Phase | Duration | Virtual Users | Description |
|---|---|---|---|
| Ramp-up | 1 min | 0 → 20 | Gradual user increase |
| Steady state | 3 min | 20 | Sustained load |
| Ramp-down | 1 min | 20 → 0 | Gradual decrease |

**Exercised endpoints:**
- `POST /login` — Authentication
- `GET /transactions/public` — Public transaction listing
- `GET /users` — User listing
- `GET /notifications` — User notifications

### Stress Test (`scripts/stress-test.js`)

Gradually increases virtual users to identify the AUT's performance limits.

| Phase | Duration | Virtual Users | Description |
|---|---|---|---|
| Ramp-up level 1 | 1 min | 0 → 10 | Initial load |
| Steady level 1 | 2 min | 10 | Baseline |
| Ramp-up level 2 | 1 min | 10 → 50 | Scale to medium load |
| Steady level 2 | 2 min | 50 | Sustained medium load |
| Ramp-up level 3 | 1 min | 50 → 100 | Scale to high load |
| Steady level 3 | 2 min | 100 | Sustained high load |
| Ramp-up level 4 | 1 min | 100 → 200 | Scale to extreme load |
| Steady level 4 | 2 min | 200 | Sustained extreme load |
| Ramp-down | 2 min | 200 → 0 | Gradual decrease |

**Exercised endpoints:**
- `POST /login` — Authentication
- `GET /transactions/public` — Public transaction listing
- `GET /users` — User listing
- `GET /notifications` — User notifications
- `GET /contacts` — User contacts

## Performance Thresholds

### Load Test

| Metric | Threshold | Description |
|---|---|---|
| `http_req_duration` | p(95) < 2s | 95% of requests must respond in under 2s |
| `http_req_failed` | rate < 0.05 | Error rate must be below 5% |

### Stress Test

| Metric | Threshold | Description |
|---|---|---|
| `http_req_duration` | p(95) < 3s | 95% of requests must respond in under 3s |
| `http_req_failed` | rate < 0.10 | Error rate must be below 10% |

If any threshold is not met, k6 returns a non-zero exit code, enabling direct integration with CI/CD pipelines.

## Configuration

The `helpers/config.js` file exports shared configuration:

- **`API_URL`** — API base URL (defaults to `http://localhost:3001`, configurable via `API_URL` environment variable)
- **`BASE_URL`** — Frontend base URL (defaults to `http://localhost:3000`, configurable via `BASE_URL` environment variable)
- **`TEST_USER`** — Credentials for the test user pre-loaded in the AUT

## Directory Structure

```
tests/k6/
├── README.md
├── scripts/
│   ├── load-test.js      # Load test scenario
│   └── stress-test.js    # Stress test scenario
└── helpers/
    └── config.js         # Shared configuration (URLs, credentials)
```

## Prerequisites

k6 must be installed on your system. See the [official k6 installation docs](https://grafana.com/docs/k6/latest/set-up/install-k6/).

**Quick install:**

```bash
# macOS (Homebrew)
brew install k6

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D68
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Windows (Chocolatey)
choco install k6
```

## Running Tests

```bash
# Run load test
k6 run scripts/load-test.js

# Run stress test
k6 run scripts/stress-test.js

# Run with JSON summary export
k6 run scripts/load-test.js --summary-export=reports/summary.json

# Run with custom API URL
API_URL=http://my-server:3001 k6 run scripts/load-test.js

# Run from project root with Makefile
make test-k6
```

## Reports

k6 displays a metrics summary in the console after execution, including:

- **Response times**: average, median, p(90), p(95), max
- **Throughput**: requests per second
- **Error rate**: percentage of failed requests
- **Checks**: percentage of successful validations
- **Threshold status**: pass/fail for each defined threshold

To export the summary to a JSON file:

```bash
k6 run scripts/load-test.js --summary-export=reports/summary.json
```
