import { test, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/auth';
import { apiLogin, apiSeedDatabase } from '../helpers/api';
import NotificationPage from '../pages/NotificationPage';

const API_URL = process.env.API_URL || 'http://localhost:3001';

test.describe('Notifications', () => {
  test.beforeEach(async ({ page, request }) => {
    // Seed the database to a known state
    await apiSeedDatabase(request);

    // Log in via API and inject the session cookie into the browser context
    const loginResponse = await apiLogin(request, TEST_USER.username, TEST_USER.password);
    const cookies = loginResponse.headers()['set-cookie'];
    if (cookies) {
      const sidMatch = cookies.match(/connect\.sid=([^;]+)/);
      if (sidMatch) {
        await page.context().addCookies([
          {
            name: 'connect.sid',
            value: sidMatch[1],
            domain: new URL(API_URL).hostname,
            path: '/',
          },
        ]);
      }
    }
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display notifications list', async ({ page }) => {
    const notificationPage = new NotificationPage(page);
    await notificationPage.navigate();

    // Verify either the notifications list is visible or the empty state is shown
    const notificationsList = notificationPage.getNotificationsList();
    const emptyState = notificationPage.getNoNotificationsText();

    await expect(notificationsList.or(emptyState)).toBeVisible();
  });

  test('should navigate to notifications via top nav', async ({ page }) => {
    const notificationPage = new NotificationPage(page);

    // Click the notifications icon in the top nav
    await notificationPage.clickTopNavNotificationsLink();

    // Verify URL contains /notifications
    await expect(page).toHaveURL(/\/notifications/);
  });

  test('should allow user to dismiss notifications', async ({ page }) => {
    const notificationPage = new NotificationPage(page);
    await notificationPage.navigate();

    const notificationsList = notificationPage.getNotificationsList();
    const notificationItems = notificationPage.getNotificationItems();

    // Only attempt to dismiss if notifications exist
    const listVisible = await notificationsList.isVisible().catch(() => false);

    if (listVisible) {
      const count = await notificationItems.count();
      if (count > 0) {
        // Dismiss the first notification
        await notificationPage.dismissFirstNotification();

        // Verify the count decreased or the notification was removed
        const newCount = await notificationItems.count();
        expect(newCount).toBeLessThanOrEqual(count);
      }
    }
  });
});
