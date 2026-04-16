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
