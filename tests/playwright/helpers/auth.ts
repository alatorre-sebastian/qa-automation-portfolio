import { type Page, expect } from '@playwright/test';

/** Default test user credentials from the AUT seed data */
export const TEST_USER = {
  username: 'Heath93',
  password: 's3cret',
};

/**
 * Logs in via the UI and waits for the dashboard to appear.
 * The AUT performs window.location.pathname = "/" after successful login,
 * which triggers a full page navigation.
 */
export async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/signin');
  await page.locator('[data-test="signin-username"] input').fill(username);
  await page.locator('[data-test="signin-password"] input').fill(password);
  await page.locator('[data-test="signin-submit"]').click();

  // The app sets window.location.pathname = "/" which causes a full page reload.
  // Wait for the URL to change away from /signin.
  await expect(page).not.toHaveURL(/\/signin/, { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
}
