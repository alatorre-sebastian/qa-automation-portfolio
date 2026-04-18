# ADR-004: Test Data Management

## Status
Accepted

## Context
E2E tests that share a database can interfere with each other. A test that creates a transaction affects the state for subsequent tests. Without data management, tests become order-dependent and flaky.

## Decision
- Seed the database via `POST /testData/seed` before test suites (not before every test)
- Use the pre-seeded test user `Heath93` for most tests
- Generate unique usernames for signup tests (`TestUser${timestamp}`)
- Run Playwright with `workers: 1` to avoid parallel DB race conditions

## Rationale
- The AUT provides a `/testData/seed` endpoint that resets the SQLite database to a known state
- Seeding per-suite (not per-test) balances clean state with execution speed
- Single worker in Playwright prevents parallel tests from seeding the DB simultaneously and wiping each other's data
- Unique usernames for signup prevent conflicts when the same test runs multiple times

## Tradeoffs
- `workers: 1` makes Playwright slower (sequential execution)
- Tests within a suite can still affect each other's state
- The seed data has randomly generated usernames, so we depend on a specific seed file

## Future improvement
- Use database transactions with rollback for true test isolation
- Or use the API to create test-specific data in `beforeEach` and clean up in `afterEach`
