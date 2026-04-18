import { test, expect } from '@playwright/test';
import { login, TEST_USER } from '../helpers/auth';
import { apiSeedDatabase } from '../helpers/api';
import TransactionDetailPage from '../pages/TransactionDetailPage';

test.describe('Transaction Detail — Likes & Comments', () => {
  test.beforeEach(async ({ page, request }) => {
    await apiSeedDatabase(request);
    await login(page, TEST_USER.username, TEST_USER.password);
  });

  test('should view transaction details', async ({ page }) => {
    const detailPage = new TransactionDetailPage(page);

    // Wait for transaction list to load and click the first transaction
    await expect(detailPage.getTransactionItems().first()).toBeVisible({ timeout: 10000 });
    await detailPage.clickFirstTransaction();

    // Verify the like button is visible on the detail page
    await expect(detailPage.getLikeButton()).toBeVisible();
  });

  test('should like a transaction', async ({ page }) => {
    const detailPage = new TransactionDetailPage(page);

    // Wait for transaction list and click the first transaction
    await expect(detailPage.getTransactionItems().first()).toBeVisible({ timeout: 10000 });
    await detailPage.clickFirstTransaction();

    // Get the initial like count
    const likeCount = detailPage.getLikeCount();
    const initialCount = await likeCount.isVisible()
      ? parseInt((await likeCount.textContent()) ?? '0', 10)
      : 0;

    // Click the like button
    await detailPage.clickLikeButton();

    // Verify the like count increased
    await expect(likeCount).toBeVisible();
    const newCountText = await likeCount.textContent();
    const newCount = parseInt(newCountText ?? '0', 10);
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should add a comment to a transaction', async ({ page }) => {
    const detailPage = new TransactionDetailPage(page);

    // Wait for transaction list and click the first transaction
    await expect(detailPage.getTransactionItems().first()).toBeVisible({ timeout: 10000 });
    await detailPage.clickFirstTransaction();

    // Verify comment input is visible
    await expect(detailPage.getCommentInput()).toBeVisible();

    // Add a comment
    await detailPage.addComment('Great transaction!');

    // Verify the comment appears in the comment list
    await expect(detailPage.getCommentListItems().first()).toBeVisible({ timeout: 10000 });
  });
});
