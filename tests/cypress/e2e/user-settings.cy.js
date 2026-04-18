describe('User Settings', () => {
  before(function () {
    cy.seedDatabase();
  });

  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.loginUser.username, users.loginUser.password);
    });
  });

  it('should navigate to user settings', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();

    cy.get('[data-test="user-settings-firstName-input"]').should('be.visible');
    cy.get('[data-test="user-settings-lastName-input"]').should('be.visible');
    cy.get('[data-test="user-settings-email-input"]').should('be.visible');
    cy.get('[data-test="user-settings-phoneNumber-input"]').should('be.visible');
  });

  it('should update first name and last name', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();

    cy.get('[data-test="user-settings-firstName-input"]').clear().type('UpdatedFirst');
    cy.get('[data-test="user-settings-lastName-input"]').clear().type('UpdatedLast');
    cy.get('[data-test="user-settings-submit"]').click();

    // Navigate back to settings and verify changes persist
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-firstName-input"]').should('have.value', 'UpdatedFirst');
    cy.get('[data-test="user-settings-lastName-input"]').should('have.value', 'UpdatedLast');
  });

  it('should update email', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();

    cy.get('[data-test="user-settings-email-input"]').clear().type('updated@example.com');
    cy.get('[data-test="user-settings-submit"]').click();

    // Navigate back to settings and verify changes persist
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-email-input"]').should('have.value', 'updated@example.com');
  });

  it('should update phone number', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();

    cy.get('[data-test="user-settings-phoneNumber-input"]').clear().type('555-123-4567');
    cy.get('[data-test="user-settings-submit"]').click();

    // Navigate back to settings and verify changes persist
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-phoneNumber-input"]').should('have.value', '555-123-4567');
  });

  it('should update all settings and verify persistence', () => {
    cy.get('[data-test="sidenav-user-settings"]').click();

    cy.get('[data-test="user-settings-firstName-input"]').clear().type('NewFirst');
    cy.get('[data-test="user-settings-lastName-input"]').clear().type('NewLast');
    cy.get('[data-test="user-settings-email-input"]').clear().type('newuser@test.com');
    cy.get('[data-test="user-settings-phoneNumber-input"]').clear().type('555-999-0000');
    cy.get('[data-test="user-settings-submit"]').click();

    // Navigate back to settings and verify all changes persist
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.get('[data-test="user-settings-firstName-input"]').should('have.value', 'NewFirst');
    cy.get('[data-test="user-settings-lastName-input"]').should('have.value', 'NewLast');
    cy.get('[data-test="user-settings-email-input"]').should('have.value', 'newuser@test.com');
    cy.get('[data-test="user-settings-phoneNumber-input"]').should('have.value', '555-999-0000');
  });
});
