# ADR-003: API Login vs UI Login

## Status
Accepted (with constraints)

## Context
Every test that requires authentication needs to log in first. Doing this through the UI for every test is slow and fragile — if the login page breaks, all tests fail, not just login tests.

## Decision
- **Login tests**: Use UI login (that's what we're testing)
- **All other UI tests**: Use UI login via a shared helper (API login didn't work cross-port)
- **API tests**: Use direct HTTP requests with session cookies
- **Database seeding**: Use `POST /testData/seed` API before test suites

## What we tried and why
We initially implemented API login for Playwright (`page.request.post('/login')`) and Cypress (`cy.loginByApi()`). Both failed because:
- The API runs on port 3001 and the frontend on port 3000
- Session cookies set by the API aren't automatically available to the browser on a different port
- Playwright's `page.request` and Cypress's `cy.request` don't share cookie jars with the browser context cross-port

## Current approach
- Playwright/Selenium: `login()` helper uses the LoginPage page object (no raw locators)
- Cypress: `cy.login()` custom command handles UI login
- API-only tests use direct HTTP clients (Playwright `request` fixture, Cypress `cy.request`, Python `requests`)

## Tradeoffs
- UI login is slower (~2-3s per test) than API login would be (~100ms)
- If the login page breaks, all tests fail (not just login tests)
- The API login approach would be ideal but requires same-origin setup (reverse proxy or single port)

## Future improvement
Set up a reverse proxy so both frontend and API are on the same origin, enabling true API login with cookie sharing.
