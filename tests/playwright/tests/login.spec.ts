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

    const loginPage = new LoginPage(page);
    await expect(loginPage.getSidenavUsername()).toContainText(TEST_USER.username, { timeout: 10000 });
  });

  test('should display error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.fillLoginFormAndSubmit('invalidUser', 'invalidPassword');

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username or password is invalid');
  });

  test('should show validation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Type and clear username to trigger validation
    await loginPage.fillUsername('User');
    await loginPage.clearUsernameAndBlur();
    await expect(loginPage.getUsernameHelperText()).toBeVisible();
    await expect(loginPage.getUsernameHelperText()).toContainText('Username is required');

    // Type short password to trigger validation
    await loginPage.fillPasswordAndBlur('abc');
    await expect(loginPage.getPasswordHelperText()).toBeVisible();
    await expect(loginPage.getPasswordHelperText()).toContainText(
      'Password must contain at least 4 characters'
    );

    // Verify submit button is disabled
    await expect(loginPage.getSubmitButton()).toBeDisabled();
  });

  test('should keep user on signin page with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Click submit without filling any fields
    await loginPage.submit();

    // User should remain on the signin page
    await expect(page).toHaveURL(/\/signin/);
  });

  test('should logout and redirect to signin page', async ({ page }) => {
    await login(page, TEST_USER.username, TEST_USER.password);

    const loginPage = new LoginPage(page);

    // Click logout in the sidenav
    await loginPage.clickLogout();

    // Verify redirect to signin page
    await expect(page).toHaveURL(/\/signin/, { timeout: 10000 });
  });
});
