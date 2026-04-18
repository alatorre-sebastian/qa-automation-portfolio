"""Transaction Detail E2E tests for Selenium.

Tests for viewing transaction details, liking transactions, and adding comments.
Mirrors the Playwright transaction-detail.spec.ts tests.
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.transaction_detail_page import TransactionDetailPage


def _login(driver: object) -> None:
    """Helper: log in with the default test user before each test."""
    login_page = LoginPage(driver)
    login_page.navigate()
    login_page.fill_username("Heath93")
    login_page.fill_password("s3cret")
    login_page.submit()

    WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))
    assert login_page.is_sidenav_username_visible()


@pytest.mark.transactiondetail
class TestTransactionDetail:
    """Tests for transaction detail — likes and comments."""

    def test_view_transaction_details(self, driver, base_url):
        """Should click a transaction and see the detail view with like button."""
        _login(driver)

        detail_page = TransactionDetailPage(driver)

        # Wait for transaction list to load and click the first transaction
        items = detail_page.get_transaction_items()
        assert len(items) > 0
        detail_page.click_first_transaction()

        # Verify the like button is visible on the detail page
        assert detail_page.is_like_button_visible()

    def test_like_a_transaction(self, driver, base_url):
        """Should like a transaction and see the like count increase."""
        _login(driver)

        detail_page = TransactionDetailPage(driver)

        # Wait for transaction list and click the first transaction
        items = detail_page.get_transaction_items()
        assert len(items) > 0
        detail_page.click_first_transaction()

        # Get the initial like count
        initial_count = detail_page.get_like_count()

        # Click the like button
        detail_page.click_like_button()

        # Verify the like count increased
        import time
        time.sleep(1)
        new_count = detail_page.get_like_count()
        assert new_count > initial_count

    def test_add_comment_to_transaction(self, driver, base_url):
        """Should add a comment to a transaction."""
        _login(driver)

        detail_page = TransactionDetailPage(driver)

        # Wait for transaction list and click the first transaction
        items = detail_page.get_transaction_items()
        assert len(items) > 0
        detail_page.click_first_transaction()

        # Verify comment input is visible
        assert detail_page.is_comment_input_visible()

        # Add a comment
        detail_page.add_comment("Great transaction!")

        # Verify the comment appears in the comment list
        import time
        time.sleep(2)
        assert detail_page.get_comment_count() >= 1
