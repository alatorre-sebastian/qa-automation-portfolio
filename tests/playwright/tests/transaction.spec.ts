import { test, expect } from '@playwright/test';
import { login, TEST_USER } from '../helpers/auth';
import TransactionPage from '../pages/TransactionPage';

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER.username, TEST_USER.password);
  });

  test('should allow a user to create a payment', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Wait for user list to load and select the first user
    const userListItems = page.locator('[data-test^="user-list-item-"]');
    await userListItems.first().waitFor({ state: 'visible' });
    await userListItems.first().click();

    // Fill transaction details
    await transactionPage.fillAmount('25');
    await transactionPage.fillDescription('Test payment');

    // Submit payment
    await transactionPage.submitPayment();

    // Verify confirmation step
    await expect(page.getByText('Paid')).toBeVisible();
    await expect(
      page.locator('[data-test="new-transaction-return-to-transactions"]')
    ).toBeVisible();
  });

  test('should allow a user to create a request', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Wait for user list to load and select the first user
    const userListItems = page.locator('[data-test^="user-list-item-"]');
    await userListItems.first().waitFor({ state: 'visible' });
    await userListItems.first().click();

    // Fill transaction details
    await transactionPage.fillAmount('50');
    await transactionPage.fillDescription('Test request');

    // Submit request
    await transactionPage.submitRequest();

    // Verify confirmation step
    await expect(page.getByText('Requested')).toBeVisible();
    await expect(
      page.locator('[data-test="new-transaction-return-to-transactions"]')
    ).toBeVisible();
  });
});
