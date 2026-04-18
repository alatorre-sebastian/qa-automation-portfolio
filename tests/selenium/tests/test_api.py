"""API-level tests using the requests-based ApiClient (no browser needed).

These tests validate the REST API directly, complementing the UI E2E tests.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from helpers.api_client import ApiClient


@pytest.fixture(autouse=True)
def seed_db(api_client):
    """Seed the database before each test."""
    api_client.seed_database()


@pytest.mark.api
class TestApi:
    """API-level tests for the cypress-realworld-app."""

    def test_login_via_api(self, api_client):
        """Should login via API and return user data."""
        data = api_client.login("Heath93", "s3cret")

        assert "user" in data
        assert data["user"]["username"] == "Heath93"

    def test_get_users(self, api_client):
        """Should get a list of users after authenticating."""
        api_client.login("Heath93", "s3cret")

        data = api_client.get_users()
        assert "results" in data
        assert len(data["results"]) > 0

    def test_create_transaction_via_api(self, api_client):
        """Should create a payment transaction via the API."""
        api_client.login("Heath93", "s3cret")

        # Get a receiver
        users_data = api_client.get_users()
        receiver = users_data["results"][0]

        data = api_client.create_transaction(
            transaction_type="payment",
            receiver_id=receiver["id"],
            description="Selenium API test payment",
            amount=1000,
        )

        assert "transaction" in data
        assert data["transaction"]["description"] == "Selenium API test payment"

    def test_get_public_transactions(self, api_client):
        """Should get public transactions."""
        api_client.login("Heath93", "s3cret")

        data = api_client.get_public_transactions()
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_get_notifications(self, api_client):
        """Should get notifications for the authenticated user."""
        api_client.login("Heath93", "s3cret")

        data = api_client.get_notifications()
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_search_for_users(self, api_client):
        """Should search for users by query string."""
        api_client.login("Heath93", "s3cret")

        data = api_client.search_users("Heath")
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_get_user_profile_by_username(self, api_client):
        """Should get a user profile by username (public endpoint)."""
        data = api_client.get_user_profile("Heath93")
        assert "user" in data
        assert "firstName" in data["user"]

    def test_create_and_get_bank_account(self, api_client):
        """Should create a bank account via the API."""
        api_client.login("Heath93", "s3cret")

        data = api_client.create_bank_account(
            bank_name="API Test Bank",
            account_number="123456789",
            routing_number="987654321",
        )
        assert "account" in data
        assert data["account"]["bankName"] == "API Test Bank"

    def test_delete_bank_account(self, api_client):
        """Should create and then delete a bank account."""
        api_client.login("Heath93", "s3cret")

        # Create a bank account first
        create_data = api_client.create_bank_account(
            bank_name="Bank To Delete",
            account_number="111222333",
            routing_number="444555666",
        )
        bank_account_id = create_data["account"]["id"]

        # Delete it
        api_client.delete_bank_account(bank_account_id)

    def test_like_a_transaction(self, api_client):
        """Should like a transaction via the API."""
        api_client.login("Heath93", "s3cret")

        # Get a public transaction to like
        tx_data = api_client.get_public_transactions()
        assert len(tx_data["results"]) > 0

        transaction_id = tx_data["results"][0]["id"]
        api_client.like_transaction(transaction_id)

    def test_comment_on_a_transaction(self, api_client):
        """Should comment on a transaction via the API."""
        api_client.login("Heath93", "s3cret")

        # Get a public transaction to comment on
        tx_data = api_client.get_public_transactions()
        assert len(tx_data["results"]) > 0

        transaction_id = tx_data["results"][0]["id"]
        api_client.comment_on_transaction(transaction_id, "Selenium API test comment")

    def test_get_contacts(self, api_client):
        """Should get contacts for a user by username."""
        api_client.login("Heath93", "s3cret")

        data = api_client.get_contacts("Heath93")
        assert "contacts" in data
        assert isinstance(data["contacts"], list)

    def test_update_user_settings(self, api_client):
        """Should update user settings via the API."""
        login_data = api_client.login("Heath93", "s3cret")
        user_id = login_data["user"]["id"]

        api_client.update_user(
            user_id,
            firstName="SeleniumFirst",
            lastName="SeleniumLast",
            email="selenium@test.com",
            phoneNumber="555-000-3333",
        )
