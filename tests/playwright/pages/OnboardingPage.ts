import { type Page, type Locator } from '@playwright/test';

export default class OnboardingPage {
  private readonly dialog: Locator;
  private readonly dialogTitle: Locator;
  private readonly nextButton: Locator;
  private readonly bankNameInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly routingNumberInput: Locator;
  private readonly bankAccountSubmit: Locator;
  private readonly transactionList: Locator;

  constructor(private page: Page) {
    this.dialog = page.locator('[data-test="user-onboarding-dialog"]');
    this.dialogTitle = page.locator('[data-test="user-onboarding-dialog-title"]');
    this.nextButton = page.locator('[data-test="user-onboarding-next"]');
    this.bankNameInput = page.locator('[data-test="bankaccount-bankName-input"] input');
    this.accountNumberInput = page.locator('[data-test="bankaccount-accountNumber-input"] input');
    this.routingNumberInput = page.locator('[data-test="bankaccount-routingNumber-input"] input');
    this.bankAccountSubmit = page.locator('[data-test="bankaccount-submit"]');
    this.transactionList = page.locator('[data-test="transaction-list"]');
  }

  getDialog(): Locator {
    return this.dialog;
  }

  getDialogTitle(): Locator {
    return this.dialogTitle;
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async fillBankName(name: string): Promise<void> {
    await this.bankNameInput.fill(name);
  }

  async fillAccountNumber(accountNumber: string): Promise<void> {
    await this.accountNumberInput.fill(accountNumber);
  }

  async fillRoutingNumber(routingNumber: string): Promise<void> {
    await this.routingNumberInput.fill(routingNumber);
  }

  async submitBankAccount(): Promise<void> {
    await this.bankAccountSubmit.click();
  }

  getTransactionList(): Locator {
    return this.transactionList;
  }
}
