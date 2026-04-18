import { type APIRequestContext, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Log in via the API and return the response (includes session cookie).
 */
export async function apiLogin(
  request: APIRequestContext,
  username: string,
  password: string,
) {
  const response = await request.post(`${API_URL}/login`, {
    data: { username, password },
  });
  expect(response.ok()).toBeTruthy();
  return response;
}

/**
 * Reset the database to its seed state.
 */
export async function apiSeedDatabase(request: APIRequestContext) {
  const response = await request.post(`${API_URL}/testData/seed`);
  expect(response.ok()).toBeTruthy();
}

/**
 * Get all users (excludes the currently authenticated user).
 */
export async function apiGetUsers(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/users`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Create a transaction (payment or request).
 */
export async function apiCreateTransaction(
  request: APIRequestContext,
  payload: {
    transactionType: 'payment' | 'request';
    receiverId: string;
    description: string;
    amount: number;
  },
) {
  const response = await request.post(`${API_URL}/transactions`, {
    data: payload,
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Get public transactions.
 */
export async function apiGetPublicTransactions(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/transactions/public`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Get notifications for the authenticated user.
 */
export async function apiGetNotifications(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/notifications`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Get bank accounts for the authenticated user.
 */
export async function apiGetBankAccounts(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/bankAccounts`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Search for users by query string.
 */
export async function apiSearchUsers(request: APIRequestContext, query: string) {
  const response = await request.get(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Get a user profile by username (public endpoint).
 */
export async function apiGetUserProfile(request: APIRequestContext, username: string) {
  const response = await request.get(`${API_URL}/users/profile/${username}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Create a bank account for the authenticated user.
 */
export async function apiCreateBankAccount(
  request: APIRequestContext,
  payload: { bankName: string; accountNumber: string; routingNumber: string },
) {
  const response = await request.post(`${API_URL}/bankAccounts`, {
    data: payload,
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Delete (soft) a bank account by ID.
 */
export async function apiDeleteBankAccount(request: APIRequestContext, bankAccountId: string) {
  const response = await request.delete(`${API_URL}/bankAccounts/${bankAccountId}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Like a transaction.
 */
export async function apiLikeTransaction(request: APIRequestContext, transactionId: string) {
  const response = await request.post(`${API_URL}/likes/${transactionId}`);
  expect(response.ok()).toBeTruthy();
}

/**
 * Comment on a transaction.
 */
export async function apiCommentOnTransaction(
  request: APIRequestContext,
  transactionId: string,
  content: string,
) {
  const response = await request.post(`${API_URL}/comments/${transactionId}`, {
    data: { content },
  });
  expect(response.ok()).toBeTruthy();
}

/**
 * Get contacts for a user by username.
 */
export async function apiGetContacts(request: APIRequestContext, username: string) {
  const response = await request.get(`${API_URL}/contacts/${username}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

/**
 * Update user settings.
 */
export async function apiUpdateUser(
  request: APIRequestContext,
  userId: string,
  payload: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string },
) {
  const response = await request.patch(`${API_URL}/users/${userId}`, {
    data: payload,
  });
  expect(response.status()).toBe(204);
}
