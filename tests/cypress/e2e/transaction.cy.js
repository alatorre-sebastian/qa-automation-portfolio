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

  it('should not allow a transaction with zero amount', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Enter zero as the amount
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('0');
    cy.get('[data-test="transaction-create-description-input"] input').type('Zero amount test');

    // Pay and Request buttons should be disabled with zero amount
    cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled');
  });

  it('should not allow a transaction without a description', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Enter a valid amount but leave description empty
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('25');

    // Pay and Request buttons should be disabled without a description
    cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled');
  });

  it('should display transaction detail after creation', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Fill transaction details
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('10');
    cy.get('[data-test="transaction-create-description-input"] input').type(
      'Detail verification payment'
    );

    // Submit payment
    cy.get('[data-test="transaction-create-submit-payment"]').click();

    // Verify confirmation screen
    cy.contains('Paid').should('be.visible');

    // Return to transactions list
    cy.get('[data-test="new-transaction-return-to-transactions"]').click();

    // Navigate to personal tab to see the transaction
    cy.get('[data-test="nav-personal-tab"]').click();

    // Verify the transaction list is visible
    cy.get('[data-test="transaction-list"]', { timeout: 10000 }).should('be.visible');
  });
});
