import { test, expect } from '@playwright/test';
import { login, TEST_USER } from '../helpers/auth';
import NotificationPage from '../pages/NotificationPage';

test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER.username, TEST_USER.password);
  });

  test('should display notifications list', async ({ page }) => {
    const notificationPage = new NotificationPage(page);
    await notificationPage.navigate();

    // Verify either the notifications list is visible or the empty state is shown
    const notificationsList = notificationPage.getNotificationsList();
    const emptyState = page.getByText('No Notifications');

    await expect(notificationsList.or(emptyState)).toBeVisible();
  });

  test('should navigate to notifications via top nav', async ({ page }) => {
    // Click the notifications icon in the top nav
    await page.locator('[data-test="nav-top-notifications-link"]').click();

    // Verify URL contains /notifications
    await expect(page).toHaveURL(/\/notifications/);
  });
});
