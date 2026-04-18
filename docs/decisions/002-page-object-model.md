# ADR-002: Page Object Model for UI Tests

## Status
Accepted

## Context
UI tests need a way to encapsulate page interactions. Without abstraction, selectors and actions are scattered across test files, making maintenance expensive when the UI changes.

## Decision
Use the Page Object Model (POM) pattern for Playwright and Selenium. Use Custom Commands for Cypress (the idiomatic Cypress approach).

## Rationale
- **Playwright/Selenium**: POM is the industry standard. Each page class owns its selectors and exposes action methods. Test files only call page object methods — zero raw locators in specs.
- **Cypress**: Custom Commands (`cy.login()`, `cy.fillSignUpFormAndSubmit()`) are the Cypress-native equivalent. Cypress's chainable API doesn't map well to class-based POM.
- Form-level helpers (e.g., `fillSignUpFormAndSubmit(user)`) accept data objects instead of individual fields, reducing duplication and making tests more readable.

## Tradeoffs
- POM adds boilerplate (one class per page)
- Cypress custom commands are less structured than POM but more idiomatic
- Form helpers hide individual field interactions, which can make debugging harder when a specific field fails
