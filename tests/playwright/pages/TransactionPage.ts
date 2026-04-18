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
  private readonly userListItems: Locator;
  private readonly publicTab: Locator;
  private readonly contactsTab: Locator;
  private readonly personalTab: Locator;
  private readonly transactionList: Locator;

  constructor(private page: Page) {
    this.newTransactionButton = page.locator('[data-test="nav-top-new-transaction"]');
    this.userSearchInput = page.locator('[data-test="user-list-search-input"]');
    this.amountInput = page.locator('[data-test="transaction-create-amount-input"] #amount');
    this.descriptionInput = page.locator('[data-test="transaction-create-description-input"] input');
    this.payButton = page.locator('[data-test="transaction-create-submit-payment"]');
    this.requestButton = page.locator('[data-test="transaction-create-submit-request"]');
    this.returnToTransactionsButton = page.locator('[data-test="new-transaction-return-to-transactions"]');
    this.createAnotherTransactionButton = page.locator('[data-test="new-transaction-create-another-transaction"]');
    this.userListItems = page.locator('[data-test^="user-list-item-"]');
    this.publicTab = page.locator('[data-test="nav-public-tab"]');
    this.contactsTab = page.locator('[data-test="nav-contacts-tab"]');
    this.personalTab = page.locator('[data-test="nav-personal-tab"]');
    this.transactionList = page.locator('[data-test="transaction-list"]');
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

  async selectFirstUser(): Promise<void> {
    await this.userListItems.first().waitFor({ state: 'visible' });
    await this.userListItems.first().click();
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

  getPayButton(): Locator {
    return this.payButton;
  }

  getRequestButton(): Locator {
    return this.requestButton;
  }

  getReturnToTransactionsButton(): Locator {
    return this.returnToTransactionsButton;
  }

  getTransactionList(): Locator {
    return this.transactionList;
  }

  async navigateToPublicTab(): Promise<void> {
    await this.publicTab.click();
  }

  async navigateToContactsTab(): Promise<void> {
    await this.contactsTab.click();
  }

  async navigateToPersonalTab(): Promise<void> {
    await this.personalTab.click();
  }

  /** Get the text content visible on the confirmation screen */
  getConfirmationText(text: string): Locator {
    return this.page.getByText(text);
  }
}
