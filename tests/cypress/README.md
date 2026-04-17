# E2E Test Suite — Cypress (JavaScript)

End-to-end test suite written in **Cypress** with **JavaScript** that validates the main flows of the cypress-realworld-app using **Custom Commands** to encapsulate reusable actions.

## Tests Included

| File | Flow | Description |
|---|---|---|
| `e2e/login.cy.js` | Login | Successful login, invalid credentials, validation errors, empty credentials |
| `e2e/signup.cy.js` | Registration | User registration with onboarding, validation errors, duplicate username |
| `e2e/transaction.cy.js` | Transactions | Create payment, create request, zero amount, empty description, transaction detail |
| `e2e/notification.cy.js` | Notifications | View notifications list, navigate via top nav, dismiss notifications |

## Custom Commands

Custom commands are defined in `support/commands.js` and loaded automatically through `support/e2e.js`.

### `cy.login(username, password)`

Logs into the AUT through the UI:

1. Navigates to `/signin`
2. Fills in the username and password fields
3. Clicks the submit button
4. Waits for the URL to change and the dashboard to be visible

**Usage example:**

```javascript
cy.login('Heath93', 's3cret');
```

## Fixtures (Test Data)

The `fixtures/users.json` file contains credentials for test users pre-loaded in the AUT:

- `defaultUser` — Primary user for most tests
- `loginUser` — Alternative user for login tests

## Configuration

The `cypress.config.js` file defines:

- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` environment variable)
- **Command timeout**: 10 seconds
- **Video**: Enabled (records each run)
- **Screenshots**: Automatic capture on failure
- **Reporter**: Mochawesome (generates HTML and JSON reports)
- **Reports directory**: `reports/`

## Directory Structure

```
tests/cypress/
├── package.json          # Project dependencies
├── cypress.config.js     # Cypress configuration
├── e2e/
│   ├── login.cy.js       # Login tests
│   ├── signup.cy.js      # Registration tests
│   ├── transaction.cy.js # Transaction tests
│   └── notification.cy.js# Notification tests
├── support/
│   ├── commands.js       # Custom commands (cy.login)
│   └── e2e.js            # Main support file
├── fixtures/
│   └── users.json        # Test data
├── reports/              # Generated Mochawesome reports
└── cypress/
    └── videos/           # Execution videos
```

## Installation

```bash
cd tests/cypress
npm install
```

## Running Tests

```bash
# Run all tests in headless mode
npx cypress run

# Run a specific test file
npx cypress run --spec "e2e/login.cy.js"

# Open Cypress in interactive mode
npx cypress open

# Run from project root with Makefile
make test-cypress
```

## Reports

After execution, Mochawesome reports are generated in `reports/`:

- `mochawesome.html` — Browsable HTML report
- `mochawesome.json` — Report data in JSON format

On failure, the following are captured automatically:
- **Screenshots** of the browser state at the moment of failure
- **Videos** of the complete execution of each spec
