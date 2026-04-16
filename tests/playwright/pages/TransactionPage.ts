import { type Page, type Locator } from '@playwright/test';

export default class TransactionPage {
  private readonly newTransactionButton: Locator;
  private readonly userSearchInput: Locator;
  private readonly amountInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly payButton: Locator;
  private readonly requestButton: Locator;
  private readonly returnToTransactionsButton: Locator;
  private readonly createAnotherTransactionButton: Locator;

  constructor(private page: Page) {
    this.newTransactionButton = page.locator('[data-test="nav-top-new-transaction"]');
    this.userSearchInput = page.locator('[data-test="user-list-search-input"]');
    this.amountInput = page.locator('[data-test="transaction-create-amount-input"] #amount');
    this.descriptionInput = page.locator('[data-test="transaction-create-description-input"] input');
    this.payButton = page.locator('[data-test="transaction-create-submit-payment"]');
    this.requestButton = page.locator('[data-test="transaction-create-submit-request"]');
    this.returnToTransactionsButton = page.locator('[data-test="new-transaction-return-to-transactions"]');
    this.createAnotherTransactionButton = page.locator('[data-test="new-transaction-create-another-transaction"]');
  }

  async navigateToNewTransaction(): Promise<void> {
    await this.newTransactionButton.click();
  }

  async searchForUser(query: string): Promise<void> {
    await this.userSearchInput.fill(query);
  }

  async selectUser(userId: string): Promise<void> {
    await this.page.locator(`[data-test="user-list-item-${userId}"]`).click();
  }

  async fillAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async submitPayment(): Promise<void> {
    await this.payButton.click();
  }

  async submitRequest(): Promise<void> {
    await this.requestButton.click();
  }

  async returnToTransactions(): Promise<void> {
    await this.returnToTransactionsButton.click();
  }

  async createAnotherTransaction(): Promise<void> {
    await this.createAnotherTransactionButton.click();
  }
}
