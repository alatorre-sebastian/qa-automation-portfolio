import { type Page, type Locator } from '@playwright/test';

export default class LoginPage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly submitButton: Locator;
  private readonly errorAlert: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly signUpLink: Locator;
  private readonly usernameHelperText: Locator;
  private readonly passwordHelperText: Locator;
  private readonly sidenavUsername: Locator;
  private readonly logoutButton: Locator;

  constructor(private page: Page) {
    this.usernameField = page.locator('[data-test="signin-username"] input');
    this.passwordField = page.locator('[data-test="signin-password"] input');
    this.submitButton = page.locator('[data-test="signin-submit"]');
    this.errorAlert = page.locator('[data-test="signin-error"]');
    this.rememberMeCheckbox = page.locator('[data-test="signin-remember-me"]');
    this.signUpLink = page.locator('[data-test="signup"]');
    this.usernameHelperText = page.locator('#username-helper-text');
    this.passwordHelperText = page.locator('#password-helper-text');
    this.sidenavUsername = page.locator('[data-test="sidenav-username"]');
    this.logoutButton = page.locator('[data-test="sidenav-signout"]');
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

  /** Fill the login form and submit */
  async fillLoginFormAndSubmit(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent()) ?? '';
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }

  /** Clear the username field and blur to trigger validation */
  async clearUsernameAndBlur(): Promise<void> {
    await this.usernameField.fill('');
    await this.usernameField.blur();
  }

  /** Fill and blur the password field (e.g. with a short value to trigger validation) */
  async fillPasswordAndBlur(password: string): Promise<void> {
    await this.passwordField.fill(password);
    await this.passwordField.blur();
  }

  getUsernameHelperText(): Locator {
    return this.usernameHelperText;
  }

  getPasswordHelperText(): Locator {
    return this.passwordHelperText;
  }

  getSubmitButton(): Locator {
    return this.submitButton;
  }

  getSidenavUsername(): Locator {
    return this.sidenavUsername;
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
