describe('Transactions', () => {
  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.loginUser.username, users.loginUser.password);
    });
  });

  it('should allow a user to create a payment', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Wait for user list to load and select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Fill transaction details
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('25');
    cy.get('[data-test="transaction-create-description-input"] input').type('Test payment');

    // Submit payment
    cy.get('[data-test="transaction-create-submit-payment"]').click();

    // Verify confirmation step
    cy.contains('Paid').should('be.visible');
    cy.get('[data-test="new-transaction-return-to-transactions"]').should('be.visible');
  });

  it('should allow a user to create a request', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Wait for user list to load and select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Fill transaction details
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('50');
    cy.get('[data-test="transaction-create-description-input"] input').type('Test request');

    // Submit request
    cy.get('[data-test="transaction-create-submit-request"]').click();

    // Verify confirmation step
    cy.contains('Requested').should('be.visible');
    cy.get('[data-test="new-transaction-return-to-transactions"]').should('be.visible');
  });
});
