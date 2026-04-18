import { test, expect } from '@playwright/test';
import { login, TEST_USER } from '../helpers/auth';
import { apiSeedDatabase } from '../helpers/api';
import UserSettingsPage from '../pages/UserSettingsPage';

test.describe('User Settings', () => {
  test.beforeEach(async ({ page, request }) => {
    await apiSeedDatabase(request);
    await login(page, TEST_USER.username, TEST_USER.password);
  });

  test('should navigate to user settings', async ({ page }) => {
    const settingsPage = new UserSettingsPage(page);
    await settingsPage.navigate();

    await expect(settingsPage.getFirstNameInput()).toBeVisible();
    await expect(settingsPage.getLastNameInput()).toBeVisible();
    await expect(settingsPage.getEmailInput()).toBeVisible();
    await expect(settingsPage.getPhoneNumberInput()).toBeVisible();
  });

  test('should update first name and last name', async ({ page }) => {
    const settingsPage = new UserSettingsPage(page);
    await settingsPage.navigate();

    await settingsPage.fillFirstName('UpdatedFirst');
    await settingsPage.fillLastName('UpdatedLast');
    await settingsPage.save();

    // Navigate back to settings and verify changes persist
    await settingsPage.navigate();
    await expect(settingsPage.getFirstNameInput()).toHaveValue('UpdatedFirst');
    await expect(settingsPage.getLastNameInput()).toHaveValue('UpdatedLast');
  });

  test('should update email', async ({ page }) => {
    const settingsPage = new UserSettingsPage(page);
    await settingsPage.navigate();

    await settingsPage.fillEmail('updated@example.com');
    await settingsPage.save();

    // Navigate back to settings and verify changes persist
    await settingsPage.navigate();
    await expect(settingsPage.getEmailInput()).toHaveValue('updated@example.com');
  });

  test('should update phone number', async ({ page }) => {
    const settingsPage = new UserSettingsPage(page);
    await settingsPage.navigate();

    await settingsPage.fillPhoneNumber('555-123-4567');
    await settingsPage.save();

    // Navigate back to settings and verify changes persist
    await settingsPage.navigate();
    await expect(settingsPage.getPhoneNumberInput()).toHaveValue('555-123-4567');
  });

  test('should update all settings and verify persistence', async ({ page }) => {
    const settingsPage = new UserSettingsPage(page);
    await settingsPage.navigate();

    await settingsPage.fillSettingsFormAndSave({
      firstName: 'NewFirst',
      lastName: 'NewLast',
      email: 'newuser@test.com',
      phoneNumber: '555-999-0000',
    });

    // Navigate back to settings and verify all changes persist
    await settingsPage.navigate();
    await expect(settingsPage.getFirstNameInput()).toHaveValue('NewFirst');
    await expect(settingsPage.getLastNameInput()).toHaveValue('NewLast');
    await expect(settingsPage.getEmailInput()).toHaveValue('newuser@test.com');
    await expect(settingsPage.getPhoneNumberInput()).toHaveValue('555-999-0000');
  });
});
