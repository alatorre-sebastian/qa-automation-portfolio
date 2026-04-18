"""API Client for direct API testing without a browser.

Wraps the cypress-realworld-app REST API using the requests library.
Used for API-level tests and database seeding.
"""

import os
import requests

API_URL = os.environ.get("API_URL", "http://localhost:3001")


class ApiClient:
    """HTTP client that maintains a session for authenticated API calls."""

    def __init__(self):
        self.session = requests.Session()
        self.base_url = API_URL

    def login(self, username: str, password: str) -> dict:
        """Log in and store the session cookie for subsequent requests."""
        response = self.session.post(
            f"{self.base_url}/login",
            json={"username": username, "password": password},
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json()

    def seed_database(self) -> None:
        """Reset the database to its seed state."""
        response = self.session.post(f"{self.base_url}/testData/seed")
        assert response.status_code == 200, f"Seed failed: {response.text}"

    def get_users(self) -> dict:
        """Get all users (excludes the currently authenticated user)."""
        response = self.session.get(f"{self.base_url}/users")
        assert response.status_code == 200, f"Get users failed: {response.text}"
        return response.json()

    def create_transaction(
        self,
        transaction_type: str,
        receiver_id: str,
        description: str,
        amount: int,
    ) -> dict:
        """Create a payment or request transaction."""
        response = self.session.post(
            f"{self.base_url}/transactions",
            json={
                "transactionType": transaction_type,
                "receiverId": receiver_id,
                "description": description,
                "amount": amount,
            },
        )
        assert response.status_code == 200, f"Create transaction failed: {response.text}"
        return response.json()

    def get_public_transactions(self) -> dict:
        """Get public transactions."""
        response = self.session.get(f"{self.base_url}/transactions/public")
        assert response.status_code == 200, f"Get public transactions failed: {response.text}"
        return response.json()

    def get_notifications(self) -> dict:
        """Get notifications for the authenticated user."""
        response = self.session.get(f"{self.base_url}/notifications")
        assert response.status_code == 200, f"Get notifications failed: {response.text}"
        return response.json()

    def get_bank_accounts(self) -> dict:
        """Get bank accounts for the authenticated user."""
        response = self.session.get(f"{self.base_url}/bankAccounts")
        assert response.status_code == 200, f"Get bank accounts failed: {response.text}"
        return response.json()
