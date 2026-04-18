describe('Transactions', () => {
  before(function () {
    cy.seedDatabase();
  });

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

  it('should disable submit buttons when form is incomplete', () => {
    // Navigate to new transaction
    cy.get('[data-test="nav-top-new-transaction"]').click();

    // Select the first user
    cy.get('[data-test^="user-list-item-"]').first().should('be.visible').click();

    // Buttons should start disabled (no amount, no description)
    cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled');

    // Fill only the amount — buttons should still be disabled (no description)
    cy.get('[data-test="transaction-create-amount-input"] #amount').type('25');
    cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled');

    // Fill the description — buttons should now be enabled
    cy.get('[data-test="transaction-create-description-input"] input').type('Form validation test');
    cy.get('[data-test="transaction-create-submit-payment"]').should('not.be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('not.be.disabled');
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

  it('should view personal transactions tab', () => {
    cy.get('[data-test="nav-personal-tab"]').click();

    cy.get('[data-test="transaction-list"]', { timeout: 10000 }).should('be.visible');
  });

  it('should view public transactions tab', () => {
    cy.get('[data-test="nav-public-tab"]').click();

    cy.get('[data-test="transaction-list"]', { timeout: 10000 }).should('be.visible');
  });

  it('should view contacts transactions tab', () => {
    cy.get('[data-test="nav-contacts-tab"]').click();

    // Contacts tab may show a list or empty state
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="transaction-list"]').length > 0) {
        cy.get('[data-test="transaction-list"]').should('be.visible');
      } else {
        cy.contains('No Transactions').should('be.visible');
      }
    });
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
