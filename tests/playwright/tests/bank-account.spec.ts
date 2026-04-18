import { test, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/auth';
import BankAccountPage from '../pages/BankAccountPage';

test.describe('Bank Accounts', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database to a known state
    const apiUrl = process.env.API_URL || 'http://localhost:3001';
    await page.request.post(`${apiUrl}/testData/seed`);

    // Log in via API — page.request shares cookies with the browser context
    await page.request.post(`${apiUrl}/login`, {
      data: { username: TEST_USER.username, password: TEST_USER.password },
    });

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
