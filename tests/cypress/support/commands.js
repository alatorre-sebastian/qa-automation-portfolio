// ***********************************************
// Custom commands for the QA Portfolio Cypress suite.
//
// For more comprehensive information on custom commands:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Logs in via the UI and waits for the dashboard to load.
 *
 * @param {string} username - The username to log in with.
 * @param {string} password - The password to log in with.
 *
 * @example
 *   cy.login('Katharina_Bernier', 's3cret');
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/signin');
  cy.get('[data-test="signin-username"] input').type(username);
  cy.get('[data-test="signin-password"] input').type(password);
  cy.get('[data-test="signin-submit"]').click();

  // Wait for the URL to change away from /signin (the app does a full page reload)
  cy.url().should('not.include', '/signin');
  cy.get('[data-test="sidenav-username"]').should('be.visible');
});

/**
 * Logs in via the API (faster than UI login). Sets the session cookie
 * so subsequent cy.visit() calls are authenticated.
 *
 * @param {string} username - The username to log in with.
 * @param {string} password - The password to log in with.
 *
 * @example
 *   cy.loginByApi('Heath93', 's3cret');
 */
Cypress.Commands.add('loginByApi', (username, password) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3001';
  cy.request({
    method: 'POST',
    url: `${apiUrl}/login`,
    body: { username, password },
  });
});

/**
 * Reset the database to its seed state via the API.
 *
 * @example
 *   cy.seedDatabase();
 */
Cypress.Commands.add('seedDatabase', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3001';
  cy.request('POST', `${apiUrl}/testData/seed`);
  // Brief wait for the database to stabilize after seeding
  cy.wait(1000);
});
