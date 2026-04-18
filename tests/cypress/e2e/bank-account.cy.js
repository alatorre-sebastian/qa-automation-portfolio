describe('Bank Accounts', () => {
  before(function () {
    cy.seedDatabase();
  });

  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.loginUser.username, users.loginUser.password);
    });
  });

  it('should display bank accounts list', () => {
    // Navigate to bank accounts via sidenav
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    cy.get('[data-test="bankaccount-list"]').should('be.visible');
    cy.get('[data-test^="bankaccount-list-item-"]').should('have.length.gte', 1);
  });

  it('should create a new bank account', () => {
    // Navigate to bank accounts via sidenav
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    cy.get('[data-test="bankaccount-list"]').should('be.visible');

    // Count existing accounts
    cy.get('[data-test^="bankaccount-list-item-"]').then(($items) => {
      const initialCount = $items.length;

      // Click create new
      cy.get('[data-test="bankaccount-new"]').click();

      // Fill the form
      cy.get('[data-test="bankaccount-bankName-input"] input').type('Test Bank');
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type('123456789');
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type('987654321');
      cy.get('[data-test="bankaccount-submit"]').click();

      // Verify the new account appears
      cy.get('[data-test="bankaccount-list"]').should('be.visible');
      cy.get('[data-test^="bankaccount-list-item-"]').should('have.length', initialCount + 1);
    });
  });

  it('should delete a bank account', () => {
    // Navigate to bank accounts via sidenav
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    cy.get('[data-test="bankaccount-list"]').should('be.visible');

    // Delete the first account
    cy.get('[data-test="bankaccount-delete"]').first().click();

    // Verify the account is marked as deleted (soft delete shows "(Deleted)")
    cy.contains('(Deleted)').should('be.visible');
  });
});
