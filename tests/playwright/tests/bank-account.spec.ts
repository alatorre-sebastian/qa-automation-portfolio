import { test, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/auth';
import { apiLogin, apiSeedDatabase } from '../helpers/api';
import BankAccountPage from '../pages/BankAccountPage';

const API_URL = process.env.API_URL || 'http://localhost:3001';

test.describe('Bank Accounts', () => {
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

  test('should display bank accounts list', async ({ page }) => {
    const bankAccountPage = new BankAccountPage(page);
    await bankAccountPage.navigate();

    await expect(bankAccountPage.getBankAccountList()).toBeVisible({ timeout: 10000 });
    const items = bankAccountPage.getBankAccountItems();
    await expect(items.first()).toBeVisible();
  });

  test('should create a new bank account', async ({ page }) => {
    const bankAccountPage = new BankAccountPage(page);
    await bankAccountPage.navigate();

    // Count existing accounts
    await expect(bankAccountPage.getBankAccountList()).toBeVisible({ timeout: 10000 });
    const initialCount = await bankAccountPage.getBankAccountItems().count();

    // Create a new bank account
    await bankAccountPage.clickCreateNew();
    await bankAccountPage.fillBankName('Test Bank');
    await bankAccountPage.fillAccountNumber('123456789');
    await bankAccountPage.fillRoutingNumber('987654321');
    await bankAccountPage.submit();

    // Verify the new account appears in the list
    await expect(bankAccountPage.getBankAccountList()).toBeVisible({ timeout: 10000 });
    await expect(bankAccountPage.getBankAccountItems()).toHaveCount(initialCount + 1);
  });

  test('should delete a bank account', async ({ page }) => {
    const bankAccountPage = new BankAccountPage(page);
    await bankAccountPage.navigate();

    await expect(bankAccountPage.getBankAccountList()).toBeVisible({ timeout: 10000 });

    // Delete the first account
    await bankAccountPage.deleteFirstAccount();

    // Verify the account is marked as deleted (soft delete shows "(Deleted)")
    await expect(bankAccountPage.getDeletedText()).toBeVisible({ timeout: 10000 });
  });
});
