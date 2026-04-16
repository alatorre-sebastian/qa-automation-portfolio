describe('Notifications', () => {
  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.loginUser.username, users.loginUser.password);
    });
  });

  it('should display notifications list', () => {
    cy.visit('/notifications');

    // Verify either the notifications list is visible or the empty state is shown
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="notifications-list"]').length > 0) {
        cy.get('[data-test="notifications-list"]').should('be.visible');
      } else {
        cy.contains('No Notifications').should('be.visible');
      }
    });
  });

  it('should navigate to notifications via top nav', () => {
    // Click the notifications icon in the top nav
    cy.get('[data-test="nav-top-notifications-link"]').click();

    // Verify URL contains /notifications
    cy.url().should('include', '/notifications');
  });
});
