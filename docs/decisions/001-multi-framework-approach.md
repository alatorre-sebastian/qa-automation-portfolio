# ADR-001: Multi-Framework Approach

## Status
Accepted

## Context
This portfolio needs to demonstrate QA automation competence. The question was whether to go deep on one framework or show breadth across multiple.

## Decision
Use 4 frameworks (Playwright, Cypress, Selenium, k6) testing the same application, each with its own CI/CD pipeline.

## Rationale
- Different companies use different stacks — showing versatility is valuable for job applications
- Testing the same app with different tools highlights the tradeoffs between frameworks
- Each framework uses a different language (TypeScript, JavaScript, Python) demonstrating multi-language ability
- k6 adds a performance testing dimension that pure E2E frameworks don't cover

## Tradeoffs
- Less depth per framework than a single-framework portfolio
- More maintenance overhead when the AUT changes
- Risk of appearing superficial if tests are too basic (mitigated by including sad paths, API tests, and design patterns)
