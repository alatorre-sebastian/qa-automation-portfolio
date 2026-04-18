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
