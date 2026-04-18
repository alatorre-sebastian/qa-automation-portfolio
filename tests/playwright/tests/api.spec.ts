import { test, expect } from '@playwright/test';
import {
  apiLogin,
  apiSeedDatabase,
  apiGetUsers,
  apiCreateTransaction,
  apiGetPublicTransactions,
  apiGetNotifications,
  apiGetBankAccounts,
} from '../helpers/api';
import { TEST_USER } from '../helpers/auth';

test.describe('API Tests', () => {
  test.beforeAll(async ({ request }) => {
    await apiSeedDatabase(request);
  });

  test('should login via API and get user data', async ({ request }) => {
    const response = await apiLogin(request, TEST_USER.username, TEST_USER.password);
    const body = await response.json();

    expect(body.user).toBeDefined();
    expect(body.user.username).toBe(TEST_USER.username);
  });

  test('should get list of users', async ({ request }) => {
    // Login first to get an authenticated session
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiGetUsers(request);
    expect(data.results).toBeDefined();
    expect(data.results.length).toBeGreaterThan(0);
  });

  test('should create a transaction via API', async ({ request }) => {
    // Login first
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    // Get a user to send the transaction to
    const usersData = await apiGetUsers(request);
    const receiver = usersData.results[0];

    const data = await apiCreateTransaction(request, {
      transactionType: 'payment',
      receiverId: receiver.id,
      description: 'API test payment',
      amount: 1000, // amount in cents
    });

    expect(data.transaction).toBeDefined();
    expect(data.transaction.description).toBe('API test payment');
  });

  test('should get public transactions', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiGetPublicTransactions(request);
    expect(data.results).toBeDefined();
    expect(Array.isArray(data.results)).toBeTruthy();
  });

  test('should get notifications', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiGetNotifications(request);
    expect(data.results).toBeDefined();
    expect(Array.isArray(data.results)).toBeTruthy();
  });

  test('should get bank accounts', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiGetBankAccounts(request);
    expect(data.results).toBeDefined();
    expect(Array.isArray(data.results)).toBeTruthy();
  });
});
