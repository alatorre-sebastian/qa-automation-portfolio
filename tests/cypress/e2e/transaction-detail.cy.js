describe('Transaction Detail — Likes & Comments', () => {
  before(function () {
    cy.seedDatabase();
  });

  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.loginUser.username, users.loginUser.password);
    });
  });

  it('should view transaction details', () => {
    // Wait for transaction list to load and click a transaction (scroll to center to avoid navbar overlap)
    cy.get('[data-test^="transaction-item-"]', { timeout: 10000 }).first().should('be.visible');
    cy.get('[data-test^="transaction-item-"]').first().scrollIntoView().click({ force: true });

    // Verify the like button is visible on the detail page
    cy.get('[data-test^="transaction-like-button-"]').should('be.visible');
  });

  it('should like a transaction', () => {
    // Wait for transaction list and click a transaction
    cy.get('[data-test^="transaction-item-"]', { timeout: 10000 }).first().should('be.visible');
    cy.get('[data-test^="transaction-item-"]').first().scrollIntoView().click({ force: true });

    // Get the initial like count
    cy.get('[data-test^="transaction-like-count-"]')
      .invoke('text')
      .then((initialText) => {
        const initialCount = parseInt(initialText, 10) || 0;

        // Click the like button
        cy.get('[data-test^="transaction-like-button-"]').click();

        // Verify the like count increased
        cy.get('[data-test^="transaction-like-count-"]')
          .invoke('text')
          .then((newText) => {
            const newCount = parseInt(newText, 10);
            expect(newCount).to.be.greaterThan(initialCount);
          });
      });
  });

  it('should add a comment to a transaction', () => {
    // Wait for transaction list and click a transaction
    cy.get('[data-test^="transaction-item-"]', { timeout: 10000 }).first().should('be.visible');
    cy.get('[data-test^="transaction-item-"]').first().scrollIntoView().click({ force: true });

    // Verify comment input is visible
    cy.get('[data-test^="transaction-comment-input-"]').should('be.visible');

    // Add a comment
    cy.get('[data-test^="transaction-comment-input-"]').type('Great transaction!{enter}');

    // Verify the comment appears in the comment list
    cy.get('[data-test^="comment-list-item-"]', { timeout: 10000 }).should('have.length.gte', 1);
  });
});
