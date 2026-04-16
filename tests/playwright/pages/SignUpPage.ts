import { type Page, type Locator } from '@playwright/test';

export default class SignUpPage {
  private readonly title: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly confirmPasswordField: Locator;
  private readonly submitButton: Locator;

  constructor(private page: Page) {
    this.title = page.locator('[data-test="signup-title"]');
    this.firstNameField = page.locator('[data-test="signup-first-name"] input');
    this.lastNameField = page.locator('[data-test="signup-last-name"] input');
    this.usernameField = page.locator('[data-test="signup-username"] input');
    this.passwordField = page.locator('[data-test="signup-password"] input');
    this.confirmPasswordField = page.locator('[data-test="signup-confirmPassword"] input');
    this.submitButton = page.locator('[data-test="signup-submit"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/signup');
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameField.fill(lastName);
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.confirmPasswordField.fill(confirmPassword);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? '';
  }
}
