describe('Sign Up', () => {
  it('should allow a visitor to sign up', () => {
    const uniqueUsername = `TestUser${Date.now()}`;

    cy.visit('/signup');

    // Fill sign-up form
    cy.get('[data-test="signup-first-name"] input').type('Bob');
    cy.get('[data-test="signup-last-name"] input').type('Ross');
    cy.get('[data-test="signup-username"] input').type(uniqueUsername);
    cy.get('[data-test="signup-password"] input').type('s3cret');
    cy.get('[data-test="signup-confirmPassword"] input').type('s3cret');
    cy.get('[data-test="signup-submit"]').click();

    // After signup, user is redirected to signin
    cy.url().should('include', '/signin');

    // Login with the new credentials
    cy.get('[data-test="signin-username"] input').type(uniqueUsername);
    cy.get('[data-test="signin-password"] input').type('s3cret');
    cy.get('[data-test="signin-submit"]').click();

    // Wait for redirect away from signin
    cy.url().should('not.include', '/signin');

    // Onboarding dialog appears for new users
    cy.get('[data-test="user-onboarding-dialog"]', { timeout: 15000 }).should('be.visible');

    // Step 1: Click Next
    cy.get('[data-test="user-onboarding-next"]').click();

    // Step 2: Fill bank account form
    cy.get('[data-test="user-onboarding-dialog-title"]').should('contain', 'Create Bank Account');
    cy.get('[data-test="bankaccount-bankName-input"] input').type('The Best Bank');
    cy.get('[data-test="bankaccount-accountNumber-input"] input').type('123456789');
    cy.get('[data-test="bankaccount-routingNumber-input"] input').type('987654321');
    cy.get('[data-test="bankaccount-submit"]').click();

    // Step 3: Finished - click Done
    cy.get('[data-test="user-onboarding-dialog-title"]').should('contain', 'Finished');
    cy.get('[data-test="user-onboarding-next"]').click();

    // Verify transaction list is visible after onboarding
    cy.get('[data-test="transaction-list"]', { timeout: 10000 }).should('be.visible');
  });

  it('should show validation errors on signup', () => {
    cy.visit('/signup');

    // Fill and clear first name to trigger validation
    cy.get('[data-test="signup-first-name"] input').type('First').clear().blur();
    cy.get('#firstName-helper-text')
      .should('be.visible')
      .and('contain', 'First Name is required');

    // Fill and clear last name
    cy.get('[data-test="signup-last-name"] input').type('Last').clear().blur();
    cy.get('#lastName-helper-text')
      .should('be.visible')
      .and('contain', 'Last Name is required');

    // Fill and clear username
    cy.get('[data-test="signup-username"] input').type('User').clear().blur();
    cy.get('#username-helper-text')
      .should('be.visible')
      .and('contain', 'Username is required');

    // Fill and clear password
    cy.get('[data-test="signup-password"] input').type('password').clear().blur();
    cy.get('#password-helper-text')
      .should('be.visible')
      .and('contain', 'Enter your password');

    // Fill confirm password with mismatch
    cy.get('[data-test="signup-password"] input').type('password');
    cy.get('[data-test="signup-confirmPassword"] input').type('DIFFERENT PASSWORD').blur();
    cy.get('#confirmPassword-helper-text')
      .should('be.visible')
      .and('contain', 'Password does not match');

    // Submit button should be disabled
    cy.get('[data-test="signup-submit"]').should('be.disabled');
  });
});
