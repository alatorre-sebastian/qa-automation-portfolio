describe('Login', () => {
  beforeEach(() => {
    cy.fixture('users').as('users');
  });

  it('should redirect unauthenticated user to signin page', () => {
    cy.visit('/personal');
    cy.url().should('include', '/signin');
  });

  it('should allow a user to login', function () {
    cy.login(this.users.loginUser.username, this.users.loginUser.password);

    cy.get('[data-test="sidenav-username"]')
      .should('be.visible')
      .and('contain', this.users.loginUser.username);
  });

  it('should display error for invalid credentials', () => {
    cy.visit('/signin');
    cy.get('[data-test="signin-username"] input').type('invalidUser');
    cy.get('[data-test="signin-password"] input').type('invalidPassword');
    cy.get('[data-test="signin-submit"]').click();

    cy.get('[data-test="signin-error"]')
      .should('be.visible')
      .and('contain', 'Username or password is invalid');
  });

  it('should show validation errors', () => {
    cy.visit('/signin');

    // Type and clear username to trigger validation
    cy.get('[data-test="signin-username"] input').type('User').clear().blur();
    cy.get('#username-helper-text')
      .should('be.visible')
      .and('contain', 'Username is required');

    // Type short password to trigger validation
    cy.get('[data-test="signin-password"] input').type('abc').blur();
    cy.get('#password-helper-text')
      .should('be.visible')
      .and('contain', 'Password must contain at least 4 characters');

    // Submit button should be disabled
    cy.get('[data-test="signin-submit"]').should('be.disabled');
  });

  it('should keep user on signin page with empty credentials', () => {
    cy.visit('/signin');

    // Click submit without filling any fields
    cy.get('[data-test="signin-submit"]').click({ force: true });

    // User should remain on the signin page
    cy.url().should('include', '/signin');
  });

  it('should logout and redirect to signin page', function () {
    cy.login(this.users.loginUser.username, this.users.loginUser.password);

    // Click logout in the sidenav
    cy.get('[data-test="sidenav-signout"]').click();

    // Verify redirect to signin page
    cy.url().should('include', '/signin');
  });
});
