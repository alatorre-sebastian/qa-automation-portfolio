import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { login, TEST_USER } from '../helpers/auth';

test.describe('Login', () => {
  test('should redirect unauthenticated user to signin page', async ({ page }) => {
    await page.goto('/personal');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should allow a user to login', async ({ page }) => {
    await login(page, TEST_USER.username, TEST_USER.password);

    // Verify the user is on the home page and the sidenav shows the username
    await expect(page.locator('[data-test="sidenav-username"]')).toContainText(TEST_USER.username, { timeout: 10000 });
  });

  test('should display error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.fillUsername('invalidUser');
    await loginPage.fillPassword('invalidPassword');
    await loginPage.submit();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username or password is invalid');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/signin');

    // Type and clear username to trigger validation
    const usernameInput = page.locator('[data-test="signin-username"] input');
    await usernameInput.fill('User');
    await usernameInput.fill('');
    await usernameInput.blur();
    await expect(page.locator('#username-helper-text')).toBeVisible();
    await expect(page.locator('#username-helper-text')).toContainText('Username is required');

    // Type short password to trigger validation
    const passwordInput = page.locator('[data-test="signin-password"] input');
    await passwordInput.fill('abc');
    await passwordInput.blur();
    await expect(page.locator('#password-helper-text')).toBeVisible();
    await expect(page.locator('#password-helper-text')).toContainText(
      'Password must contain at least 4 characters'
    );

    // Verify submit button is disabled
    await expect(page.locator('[data-test="signin-submit"]')).toBeDisabled();
  });
});
