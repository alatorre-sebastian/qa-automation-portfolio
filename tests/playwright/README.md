# E2E Test Suite — Playwright (TypeScript)

End-to-end test suite written in **Playwright** with **TypeScript** that validates the main flows of the cypress-realworld-app using the **Page Object Model (POM)** pattern.

## Tests Included

| File | Flow | Description |
|---|---|---|
| `tests/login.spec.ts` | Login | Successful login, invalid credentials |
| `tests/signup.spec.ts` | Registration | User registration with valid data |
| `tests/transaction.spec.ts` | Transactions | Creating and viewing transactions |
| `tests/notification.spec.ts` | Notifications | Viewing user notifications |

## Design Pattern: Page Object Model

Each page of the AUT is encapsulated in a class inside the `pages/` directory. Page Objects expose methods representing user actions, keeping selectors isolated from tests.

**Available Page Objects:**

- `LoginPage.ts` — Methods: `navigate()`, `fillUsername()`, `fillPassword()`, `submit()`, `getErrorMessage()`
- `SignUpPage.ts` — Methods for the complete registration flow
- `TransactionPage.ts` — Methods for creating and viewing transactions
- `NotificationPage.ts` — Methods for viewing notifications

Additionally, `helpers/auth.ts` provides a reusable `login()` utility function for tests.

## Configuration

The `playwright.config.ts` file defines:

- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` environment variable)
- **Browsers**: Chromium and Firefox
- **Timeout**: 30 seconds per test
- **Retries**: 1 retry per test
- **Screenshots**: Only on failure (`only-on-failure`)
- **Traces**: On first retry (`on-first-retry`)
- **Reporter**: HTML (generated automatically)

## Directory Structure

```
tests/playwright/
├── package.json              # Project dependencies
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── helpers/
│   └── auth.ts               # Login utility function
├── pages/
│   ├── LoginPage.ts          # Page Object - Login
│   ├── SignUpPage.ts         # Page Object - Registration
│   ├── TransactionPage.ts   # Page Object - Transactions
│   └── NotificationPage.ts  # Page Object - Notifications
├── tests/
│   ├── login.spec.ts         # Login tests
│   ├── signup.spec.ts        # Registration tests
│   ├── transaction.spec.ts   # Transaction tests
│   └── notification.spec.ts  # Notification tests
├── playwright-report/        # Generated HTML report
└── test-results/             # Execution results and artifacts
```

## Installation

```bash
cd tests/playwright
npm install
npx playwright install --with-deps
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run in headed mode (visible browser)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/login.spec.ts

# Run from project root with Makefile
make test-playwright
```

## Reports

After execution, the HTML report is generated in `playwright-report/`.

To view the report:

```bash
npx playwright show-report
```

On failure, the following are captured automatically:
- **Screenshots** of the browser state at the moment of failure
- **Traces** on first retry (browsable with Playwright's Trace Viewer)
