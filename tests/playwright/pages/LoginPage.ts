import { type Page, type Locator } from '@playwright/test';

export default class LoginPage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly submitButton: Locator;
  private readonly errorAlert: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly signUpLink: Locator;

  constructor(private page: Page) {
    this.usernameField = page.locator('[data-test="signin-username"] input');
    this.passwordField = page.locator('[data-test="signin-password"] input');
    this.submitButton = page.locator('[data-test="signin-submit"]');
    this.errorAlert = page.locator('[data-test="signin-error"]');
    this.rememberMeCheckbox = page.locator('[data-test="signin-remember-me"]');
    this.signUpLink = page.locator('[data-test="signup"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/signin');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent()) ?? '';
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }
}
