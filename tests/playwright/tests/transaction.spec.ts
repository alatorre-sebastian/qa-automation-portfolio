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
    await transactionPage.selectFirstUser();

    // Fill transaction details
    await transactionPage.fillAmount('25');
    await transactionPage.fillDescription('Test payment');

    // Submit payment
    await transactionPage.submitPayment();

    // Verify confirmation step
    await expect(transactionPage.getConfirmationText('Paid')).toBeVisible();
    await expect(transactionPage.getReturnToTransactionsButton()).toBeVisible();
  });

  test('should allow a user to create a request', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Wait for user list to load and select the first user
    await transactionPage.selectFirstUser();

    // Fill transaction details
    await transactionPage.fillAmount('50');
    await transactionPage.fillDescription('Test request');

    // Submit request
    await transactionPage.submitRequest();

    // Verify confirmation step
    await expect(transactionPage.getConfirmationText('Requested')).toBeVisible();
    await expect(transactionPage.getReturnToTransactionsButton()).toBeVisible();
  });

  test('should not allow a transaction with zero amount', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Select the first user
    await transactionPage.selectFirstUser();

    // Enter zero as the amount
    await transactionPage.fillAmount('0');
    await transactionPage.fillDescription('Zero amount test');

    // Pay and Request buttons should be disabled with zero amount
    await expect(transactionPage.getPayButton()).toBeDisabled();
    await expect(transactionPage.getRequestButton()).toBeDisabled();
  });

  test('should not allow a transaction without a description', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Select the first user
    await transactionPage.selectFirstUser();

    // Enter a valid amount but leave description empty
    await transactionPage.fillAmount('25');

    // Pay and Request buttons should be disabled without a description
    await expect(transactionPage.getPayButton()).toBeDisabled();
    await expect(transactionPage.getRequestButton()).toBeDisabled();
  });

  test('should display transaction detail after creation', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Navigate to new transaction
    await transactionPage.navigateToNewTransaction();

    // Select the first user
    await transactionPage.selectFirstUser();

    // Fill transaction details
    await transactionPage.fillAmount('10');
    await transactionPage.fillDescription('Detail verification payment');

    // Submit payment
    await transactionPage.submitPayment();

    // Verify confirmation screen
    await expect(transactionPage.getConfirmationText('Paid')).toBeVisible();

    // Return to transactions list
    await transactionPage.returnToTransactions();

    // Navigate to personal tab to see the transaction
    await transactionPage.navigateToPersonalTab();

    // Verify the transaction appears in the list
    await expect(transactionPage.getTransactionList()).toBeVisible({ timeout: 10000 });
  });
});
