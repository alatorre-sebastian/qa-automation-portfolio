import { type Page, type Locator } from '@playwright/test';

export default class TransactionDetailPage {
  private readonly transactionItems: Locator;
  private readonly commentInput: Locator;

  constructor(private page: Page) {
    this.transactionItems = page.locator('[data-test^="transaction-item-"]');
    this.commentInput = page.locator('[data-test^="transaction-comment-input-"]');
  }

  async clickFirstTransaction(): Promise<void> {
    await this.transactionItems.first().click();
  }

  getLikeButton(): Locator {
    return this.page.locator('[data-test^="transaction-like-button-"]').first();
  }

  getLikeCount(): Locator {
    return this.page.locator('[data-test^="transaction-like-count-"]').first();
  }

  async clickLikeButton(): Promise<void> {
    await this.getLikeButton().click();
  }

  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await this.commentInput.press('Enter');
  }

  getCommentInput(): Locator {
    return this.commentInput;
  }

  getCommentListItems(): Locator {
    return this.page.locator('[data-test^="comment-list-item-"]');
  }

  getTransactionItems(): Locator {
    return this.transactionItems;
  }
}
