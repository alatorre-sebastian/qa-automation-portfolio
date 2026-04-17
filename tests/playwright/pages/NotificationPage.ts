import { type Page, type Locator } from '@playwright/test';

export default class NotificationPage {
  private readonly sidenavNotificationsLink: Locator;
  private readonly topNavNotificationsLink: Locator;
  private readonly notificationsCount: Locator;
  private readonly notificationsList: Locator;
  private readonly noNotificationsText: Locator;

  constructor(private page: Page) {
    this.sidenavNotificationsLink = page.locator('[data-test="sidenav-notifications"]');
    this.topNavNotificationsLink = page.locator('[data-test="nav-top-notifications-link"]');
    this.notificationsCount = page.locator('[data-test="nav-top-notifications-count"]');
    this.notificationsList = page.locator('[data-test="notifications-list"]');
    this.noNotificationsText = page.getByText('No Notifications');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/notifications');
  }

  async clickTopNavNotificationsLink(): Promise<void> {
    await this.topNavNotificationsLink.click();
  }

  getNotificationsList(): Locator {
    return this.notificationsList;
  }

  getNoNotificationsText(): Locator {
    return this.noNotificationsText;
  }

  getNotificationItems(): Locator {
    return this.page.locator('[data-test^="notification-list-item-"]');
  }

  async dismissNotification(notificationId: string): Promise<void> {
    await this.page.locator(`[data-test="notification-mark-read-${notificationId}"]`).click();
  }

  /** Click the dismiss button on the first notification item */
  async dismissFirstNotification(): Promise<void> {
    const firstDismissButton = this.page.locator('[data-test^="notification-mark-read-"]').first();
    await firstDismissButton.click();
  }

  async getNotificationsCount(): Promise<string> {
    return (await this.notificationsCount.textContent()) ?? '';
  }
}
