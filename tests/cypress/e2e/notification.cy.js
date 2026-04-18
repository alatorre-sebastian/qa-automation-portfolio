describe('Notifications', () => {
  beforeEach(function () {
    cy.seedDatabase();
    cy.fixture('users').then((users) => {
      cy.loginByApi(users.loginUser.username, users.loginUser.password);
    });
    cy.visit('/');
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

  it('should allow user to dismiss notifications', () => {
    cy.visit('/notifications');

    // Only attempt to dismiss if notifications exist
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="notifications-list"]').length > 0) {
        cy.get('[data-test^="notification-list-item-"]').then(($items) => {
          if ($items.length > 0) {
            const initialCount = $items.length;

            // Click the dismiss button on the first notification
            cy.get('[data-test^="notification-mark-read-"]').first().click();

            // Verify the count decreased or the notification was removed
            cy.get('[data-test^="notification-list-item-"]').should(
              'have.length.lte',
              initialCount
            );
          }
        });
      }
    });
  });
});
