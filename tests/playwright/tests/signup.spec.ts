import { test, expect } from '@playwright/test';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';

test.describe('Sign Up', () => {
  test('should allow a visitor to sign up', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.navigate();

    // Fill sign-up form with a unique username
    const uniqueUsername = `TestUser${Date.now()}`;
    await signUpPage.fillFirstName('Bob');
    await signUpPage.fillLastName('Ross');
    await signUpPage.fillUsername(uniqueUsername);
    await signUpPage.fillPassword('s3cret');
    await signUpPage.fillConfirmPassword('s3cret');
    await signUpPage.submit();

    // After signup, user is redirected to signin
    await page.waitForURL(/\/signin/);

    // Login with the new credentials
    const loginPage = new LoginPage(page);
    await loginPage.fillUsername(uniqueUsername);
    await loginPage.fillPassword('s3cret');
    await loginPage.submit();

    // After login the app performs a full page reload
    // Wait for the URL to change away from /signin
    await expect(page).not.toHaveURL(/\/signin/, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');

    // Onboarding dialog appears for new users
    const onboardingDialog = page.locator('[data-test="user-onboarding-dialog"]');
    await expect(onboardingDialog).toBeVisible({ timeout: 15000 });

    // Step 1: Click Next
    await page.locator('[data-test="user-onboarding-next"]').click();

    // Step 2: Fill bank account form
    await expect(page.locator('[data-test="user-onboarding-dialog-title"]')).toContainText(
      'Create Bank Account'
    );
    await page.locator('[data-test="bankaccount-bankName-input"] input').fill('The Best Bank');
    await page.locator('[data-test="bankaccount-accountNumber-input"] input').fill('123456789');
    await page.locator('[data-test="bankaccount-routingNumber-input"] input').fill('987654321');
    await page.locator('[data-test="bankaccount-submit"]').click();

    // Step 3: Finished - click Done
    await expect(page.locator('[data-test="user-onboarding-dialog-title"]')).toContainText(
      'Finished'
    );
    await page.locator('[data-test="user-onboarding-next"]').click();

    // Verify transaction list is visible after onboarding
    await expect(page.locator('[data-test="transaction-list"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show validation errors on signup', async ({ page }) => {
    await page.goto('/signup');

    // Fill and clear first name to trigger validation
    const firstNameInput = page.locator('[data-test="signup-first-name"] input');
    await firstNameInput.fill('First');
    await firstNameInput.fill('');
    await firstNameInput.blur();
    await expect(page.locator('#firstName-helper-text')).toBeVisible();
    await expect(page.locator('#firstName-helper-text')).toContainText('First Name is required');

    // Fill and clear last name
    const lastNameInput = page.locator('[data-test="signup-last-name"] input');
    await lastNameInput.fill('Last');
    await lastNameInput.fill('');
    await lastNameInput.blur();
    await expect(page.locator('#lastName-helper-text')).toBeVisible();
    await expect(page.locator('#lastName-helper-text')).toContainText('Last Name is required');

    // Fill and clear username
    const usernameInput = page.locator('[data-test="signup-username"] input');
    await usernameInput.fill('User');
    await usernameInput.fill('');
    await usernameInput.blur();
    await expect(page.locator('#username-helper-text')).toBeVisible();
    await expect(page.locator('#username-helper-text')).toContainText('Username is required');

    // Fill and clear password
    const passwordInput = page.locator('[data-test="signup-password"] input');
    await passwordInput.fill('password');
    await passwordInput.fill('');
    await passwordInput.blur();
    await expect(page.locator('#password-helper-text')).toBeVisible();
    await expect(page.locator('#password-helper-text')).toContainText('Enter your password');

    // Fill confirm password with mismatch
    await passwordInput.fill('password');
    const confirmPasswordInput = page.locator('[data-test="signup-confirmPassword"] input');
    await confirmPasswordInput.fill('DIFFERENT PASSWORD');
    await confirmPasswordInput.blur();
    await expect(page.locator('#confirmPassword-helper-text')).toBeVisible();
    await expect(page.locator('#confirmPassword-helper-text')).toContainText(
      'Password does not match'
    );

    // After triggering validation errors, submit button should be disabled
    await expect(page.locator('[data-test="signup-submit"]')).toBeDisabled();
  });
});
