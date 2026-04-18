import { test, expect } from '@playwright/test';
import {
  apiLogin,
  apiSeedDatabase,
  apiGetUsers,
  apiCreateTransaction,
  apiGetPublicTransactions,
  apiGetNotifications,
  apiGetBankAccounts,
  apiSearchUsers,
  apiGetUserProfile,
  apiCreateBankAccount,
  apiDeleteBankAccount,
  apiLikeTransaction,
  apiCommentOnTransaction,
  apiGetContacts,
  apiUpdateUser,
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

  test('should search for users', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiSearchUsers(request, 'Heath');
    expect(data.results).toBeDefined();
    expect(Array.isArray(data.results)).toBeTruthy();
  });

  test('should get user profile by username', async ({ request }) => {
    const data = await apiGetUserProfile(request, TEST_USER.username);
    expect(data.user).toBeDefined();
    expect(data.user.firstName).toBeDefined();
  });

  test('should create and get a bank account', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiCreateBankAccount(request, {
      bankName: 'API Test Bank',
      accountNumber: '123456789',
      routingNumber: '987654321',
    });

    expect(data.account).toBeDefined();
    expect(data.account.bankName).toBe('API Test Bank');
  });

  test('should delete a bank account', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    // Create a bank account first
    const createData = await apiCreateBankAccount(request, {
      bankName: 'Bank To Delete',
      accountNumber: '111222333',
      routingNumber: '444555666',
    });

    const bankAccountId = createData.account.id;

    // Delete it
    await apiDeleteBankAccount(request, bankAccountId);
  });

  test('should like a transaction', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    // Get a public transaction to like
    const txData = await apiGetPublicTransactions(request);
    expect(txData.results.length).toBeGreaterThan(0);

    const transactionId = txData.results[0].id;
    await apiLikeTransaction(request, transactionId);
  });

  test('should comment on a transaction', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    // Get a public transaction to comment on
    const txData = await apiGetPublicTransactions(request);
    expect(txData.results.length).toBeGreaterThan(0);

    const transactionId = txData.results[0].id;
    await apiCommentOnTransaction(request, transactionId, 'API test comment');
  });

  test('should get contacts', async ({ request }) => {
    await apiLogin(request, TEST_USER.username, TEST_USER.password);

    const data = await apiGetContacts(request, TEST_USER.username);
    expect(data.contacts).toBeDefined();
    expect(Array.isArray(data.contacts)).toBeTruthy();
  });

  test('should update user settings', async ({ request }) => {
    const loginResponse = await apiLogin(request, TEST_USER.username, TEST_USER.password);
    const loginBody = await loginResponse.json();
    const userId = loginBody.user.id;

    await apiUpdateUser(request, userId, {
      firstName: 'APIFirst',
      lastName: 'APILast',
      email: 'api@test.com',
      phoneNumber: '555-000-1111',
    });
  });
});
