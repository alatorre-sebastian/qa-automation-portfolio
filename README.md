# 🧪 QA Automation Portfolio

![Playwright](https://img.shields.io/badge/-Playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Cypress](https://img.shields.io/badge/-Cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![Selenium](https://img.shields.io/badge/-Selenium-%2343B02A?style=for-the-badge&logo=selenium&logoColor=white)
![k6](https://img.shields.io/badge/-k6-%237D64FF?style=for-the-badge&logo=k6&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-%232088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white)

QA Automation Engineer portfolio demonstrating proficiency across **4 testing frameworks** running against the same real-world application. Each suite has its own independent CI/CD pipeline in GitHub Actions.

[![Playwright Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/playwright.yml)
[![Cypress Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/cypress.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/cypress.yml)
[![Selenium Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/selenium.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/selenium.yml)
[![k6 Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/k6.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/k6.yml)

---

## What This Project Demonstrates

| Skill | How It's Demonstrated |
|---|---|
| **Multi-framework** | 4 independent suites: Playwright, Cypress, Selenium, k6 |
| **Multi-language** | TypeScript, JavaScript, Python |
| **Design patterns** | Page Object Model (Playwright, Selenium), Custom Commands (Cypress) |
| **Performance testing** | Load and stress tests with k6 against the REST API |
| **CI/CD** | 4 independent GitHub Actions pipelines with artifacts |
| **Infrastructure** | Docker Compose for the AUT, Makefile as unified interface |
| **Documentation** | Per-framework README, HTML reports, clear structure |

---

## Test Suites

All suites run against the [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), a Venmo-like financial application with authentication, transactions, notifications, and user profiles.

### 🎭 Playwright — TypeScript E2E

**Pattern**: Page Object Model | **Browsers**: Chromium, Firefox

```
tests/playwright/
├── pages/          → LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → login, signup, transaction, notification specs
└── playwright.config.ts
```

**Tests**: Successful/failed login · User registration · Transaction creation · Notifications
**Reports**: Interactive HTML with failure screenshots and traces for debugging

📂 [View code](tests/playwright/) · 📄 [View README](tests/playwright/README.md)

---

### 🌲 Cypress — JavaScript E2E

**Pattern**: Custom Commands | **Reporter**: Mochawesome

```
tests/cypress/
├── e2e/            → login, signup, transaction, notification specs
├── support/        → cy.login() custom command
├── fixtures/       → test data (users.json)
└── cypress.config.js
```

**Tests**: Login with custom command · Registration · Transactions · Notifications
**Reports**: Mochawesome HTML/JSON with video recording of each run

📂 [View code](tests/cypress/) · 📄 [View README](tests/cypress/README.md)

---

### 🔬 Selenium — Python E2E

**Pattern**: Page Object Model + pytest | **Driver**: Headless Chrome (webdriver-manager)

```
tests/selenium/
├── pages/          → BasePage, LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → test_login, test_signup, test_transaction, test_notification
└── conftest.py     → fixtures + automatic screenshot on failure
```

**Tests**: Login with validations · Registration · Transactions · Notifications
**Reports**: Self-contained pytest-html with failure screenshots

📂 [View code](tests/selenium/) · 📄 [View README](tests/selenium/README.md)

---

### ⚡ k6 — Performance Testing

**Type**: Load & Stress testing against the REST API

```
tests/k6/
├── scripts/        → load-test.js (20 VUs), stress-test.js (up to 200 VUs)
└── helpers/        → config.js (URLs, credentials)
```

| Scenario | Virtual Users | Duration | Thresholds |
|---|---|---|---|
| **Load** | Ramp-up to 20 VUs | ~5 min | p(95) < 2s, errors < 5% |
| **Stress** | 10 → 50 → 100 → 200 VUs | ~14 min | p(95) < 3s, errors < 10% |

**Endpoints**: POST /login · GET /transactions/public · GET /users · GET /notifications

📂 [View code](tests/k6/) · 📄 [View README](tests/k6/README.md)

---

## CI/CD

Each framework has its own GitHub Actions workflow. They run in parallel on every push/PR to `main`.

```
.github/workflows/
├── playwright.yml    → Build Docker → Playwright tests → Publish HTML report
├── cypress.yml       → Build Docker → Cypress tests    → Publish Mochawesome report
├── selenium.yml      → Build Docker → Selenium tests   → Publish pytest-html report
└── k6.yml            → Build Docker → k6 load test     → Publish JSON summary
```

Each workflow:
1. Clones the repo with the AUT submodule
2. Builds and starts the app with Docker Compose
3. Runs the test suite
4. Publishes reports as downloadable artifacts (from the Actions tab)
5. Tears down the container

---

## Project Structure

```
qa-automation-portfolio/
├── apps/
│   └── cypress-realworld-app/    # AUT (Git submodule)
├── tests/
│   ├── playwright/               # TypeScript E2E
│   ├── cypress/                  # JavaScript E2E
│   ├── selenium/                 # Python E2E
│   └── k6/                       # Performance
├── .github/workflows/            # 4 CI/CD pipelines
├── docker-compose.yml            # AUT orchestration
├── Dockerfile.aut                # AUT Docker image
├── Makefile                      # Unified interface
└── .env.example                  # Environment variables
```

---

## Running Locally

<details>
<summary><strong>Prerequisites</strong></summary>

| Tool | Verify |
|---|---|
| Git | `git --version` |
| Docker + Docker Compose | `docker compose version` |
| Node.js 18+ | `node --version` |
| Python 3.9+ | `python --version` |
| k6 | `k6 version` |

</details>

<details>
<summary><strong>Installation</strong></summary>

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/alatorre-sebastian/qa-automation-portfolio.git
cd qa-automation-portfolio

# If you already cloned without submodules
git submodule update --init --recursive

# Install dependencies per framework
cd tests/playwright && npm install && npx playwright install --with-deps && cd ../..
cd tests/cypress && npm install && cd ../..
cd tests/selenium && pip install -r requirements.txt && cd ../..
```

</details>

<details>
<summary><strong>Running tests</strong></summary>

```bash
# Start the app
make start-aut

# Run all suites
make test-all

# Or run a single suite
make test-playwright
make test-cypress
make test-selenium
make test-k6

# Stop the app
make stop-aut
```

</details>

---

## Tech Stack

| Category | Technologies |
|---|---|
| **E2E Testing** | Playwright, Cypress, Selenium WebDriver |
| **Performance** | k6 (Grafana) |
| **Languages** | TypeScript, JavaScript, Python |
| **Test Runners** | Playwright Test, Cypress, pytest |
| **CI/CD** | GitHub Actions (4 independent workflows) |
| **Infrastructure** | Docker Compose, Makefile |
| **Reports** | Playwright HTML, Mochawesome, pytest-html, k6 JSON |
