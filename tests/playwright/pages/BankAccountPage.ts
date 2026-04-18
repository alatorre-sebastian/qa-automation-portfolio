import { type Page, type Locator } from '@playwright/test';

export default class BankAccountPage {
  private readonly sidenavBankAccountsLink: Locator;
  private readonly bankAccountList: Locator;
  private readonly bankAccountItems: Locator;
  private readonly createNewButton: Locator;
  private readonly bankNameInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly routingNumberInput: Locator;
  private readonly submitButton: Locator;
  private readonly deleteButtons: Locator;

  constructor(private page: Page) {
    this.sidenavBankAccountsLink = page.locator('[data-test="sidenav-bankaccounts"]');
    this.bankAccountList = page.locator('[data-test="bankaccount-list"]');
    this.bankAccountItems = page.locator('[data-test^="bankaccount-list-item-"]');
    this.createNewButton = page.locator('[data-test="bankaccount-new"]');
    this.bankNameInput = page.locator('[data-test="bankaccount-bankName-input"]');
    this.accountNumberInput = page.locator('[data-test="bankaccount-accountNumber-input"]');
    this.routingNumberInput = page.locator('[data-test="bankaccount-routingNumber-input"]');
    this.submitButton = page.locator('[data-test="bankaccount-submit"]');
    this.deleteButtons = page.locator('[data-test^="bankaccount-delete-"]');
  }

  async navigate(): Promise<void> {
    await this.sidenavBankAccountsLink.click();
  }

  getBankAccountList(): Locator {
    return this.bankAccountList;
  }

  getBankAccountItems(): Locator {
    return this.bankAccountItems;
  }

  async clickCreateNew(): Promise<void> {
    await this.createNewButton.click();
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

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async deleteFirstAccount(): Promise<void> {
    await this.deleteButtons.first().click();
  }

  getDeleteButtons(): Locator {
    return this.deleteButtons;
  }

  getDeletedText(): Locator {
    return this.page.getByText('(Deleted)');
  }
}
