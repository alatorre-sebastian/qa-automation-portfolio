import { test, expect } from '@playwright/test';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import OnboardingPage from '../pages/OnboardingPage';

test.describe('Sign Up', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database to a known state before each signup test
    const apiUrl = process.env.API_URL || 'http://localhost:3001';
    await page.request.post(`${apiUrl}/testData/seed`);
  });

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
    const onboardingPage = new OnboardingPage(page);
    await expect(onboardingPage.getDialog()).toBeVisible({ timeout: 15000 });

    // Step 1: Click Next
    await onboardingPage.clickNext();

    // Step 2: Fill bank account form
    await expect(onboardingPage.getDialogTitle()).toContainText('Create Bank Account');
    await onboardingPage.fillBankName('The Best Bank');
    await onboardingPage.fillAccountNumber('123456789');
    await onboardingPage.fillRoutingNumber('987654321');
    await onboardingPage.submitBankAccount();

    // Step 3: Finished - click Done
    await expect(onboardingPage.getDialogTitle()).toContainText('Finished');
    await onboardingPage.clickNext();

    // Verify transaction list is visible after onboarding
    await expect(onboardingPage.getTransactionList()).toBeVisible({ timeout: 10000 });
  });

  test('should show validation errors on signup', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.navigate();

    // Fill and clear first name to trigger validation
    await signUpPage.fillFirstName('First');
    await signUpPage.clearFirstNameAndBlur();
    await expect(signUpPage.getFirstNameHelperText()).toBeVisible();
    await expect(signUpPage.getFirstNameHelperText()).toContainText('First Name is required');

    // Fill and clear last name
    await signUpPage.fillLastName('Last');
    await signUpPage.clearLastNameAndBlur();
    await expect(signUpPage.getLastNameHelperText()).toBeVisible();
    await expect(signUpPage.getLastNameHelperText()).toContainText('Last Name is required');

    // Fill and clear username
    await signUpPage.fillUsername('User');
    await signUpPage.clearUsernameAndBlur();
    await expect(signUpPage.getUsernameHelperText()).toBeVisible();
    await expect(signUpPage.getUsernameHelperText()).toContainText('Username is required');

    // Fill and clear password
    await signUpPage.fillPassword('password');
    await signUpPage.clearPasswordAndBlur();
    await expect(signUpPage.getPasswordHelperText()).toBeVisible();
    await expect(signUpPage.getPasswordHelperText()).toContainText('Enter your password');

    // Fill confirm password with mismatch
    await signUpPage.fillPassword('password');
    await signUpPage.fillConfirmPasswordAndBlur('DIFFERENT PASSWORD');
    await expect(signUpPage.getConfirmPasswordHelperText()).toBeVisible();
    await expect(signUpPage.getConfirmPasswordHelperText()).toContainText(
      'Password does not match'
    );

    // After triggering validation errors, submit button should be disabled
    await expect(signUpPage.getSubmitButton()).toBeDisabled();
  });

  test('should not allow signup with duplicate username', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.navigate();

    // Try to register with an existing username
    await signUpPage.fillFirstName('Duplicate');
    await signUpPage.fillLastName('User');
    await signUpPage.fillUsername('Heath93');
    await signUpPage.fillPassword('s3cret');
    await signUpPage.fillConfirmPassword('s3cret');
    await signUpPage.submit();

    // User should remain on the signup page (not redirected to signin)
    await expect(page).toHaveURL(/\/signup/);
  });
});
