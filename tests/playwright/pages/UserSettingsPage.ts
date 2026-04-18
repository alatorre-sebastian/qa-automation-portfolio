import { type Page, type Locator } from '@playwright/test';

export default class UserSettingsPage {
  private readonly sidenavUserSettingsLink: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly saveButton: Locator;

  constructor(private page: Page) {
    this.sidenavUserSettingsLink = page.locator('[data-test="sidenav-user-settings"]');
    this.firstNameInput = page.locator('[data-test="user-settings-firstName-input"]');
    this.lastNameInput = page.locator('[data-test="user-settings-lastName-input"]');
    this.emailInput = page.locator('[data-test="user-settings-email-input"]');
    this.phoneNumberInput = page.locator('[data-test="user-settings-phoneNumber-input"]');
    this.saveButton = page.locator('[data-test="user-settings-submit"]');
  }

  async navigate(): Promise<void> {
    await this.sidenavUserSettingsLink.click();
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  /** Fill all user settings fields and save */
  async fillSettingsFormAndSave(settings: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }): Promise<void> {
    await this.fillFirstName(settings.firstName);
    await this.fillLastName(settings.lastName);
    await this.fillEmail(settings.email);
    await this.fillPhoneNumber(settings.phoneNumber);
    await this.save();
  }

  getFirstNameInput(): Locator {
    return this.firstNameInput;
  }

  getLastNameInput(): Locator {
    return this.lastNameInput;
  }

  getEmailInput(): Locator {
    return this.emailInput;
  }

  getPhoneNumberInput(): Locator {
    return this.phoneNumberInput;
  }

  getSaveButton(): Locator {
    return this.saveButton;
  }
}
