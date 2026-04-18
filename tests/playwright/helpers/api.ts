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
