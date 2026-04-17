"""Transaction E2E tests for Selenium.

Mirrors the Playwright transaction.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.transaction_page import TransactionPage


def _login(driver: object) -> None:
    """Helper: log in with the default test user before each test."""
    login_page = LoginPage(driver)
    login_page.navigate()
    login_page.fill_username("Heath93")
    login_page.fill_password("s3cret")
    login_page.submit()

    # Wait for the URL to change away from /signin (full page reload)
    WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))

    # Wait for sidenav username to confirm dashboard is loaded
    assert login_page.is_sidenav_username_visible()


@pytest.mark.transaction
class TestTransaction:
    """Tests for creating transactions (payments and requests)."""

    def test_create_payment(self, driver, base_url):
        """A user should be able to create a payment transaction."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        transaction_page.wait_for_user_list()
        transaction_page.select_first_user()

        # Fill transaction details
        transaction_page.fill_amount("25")
        transaction_page.fill_description("Test payment")

        # Submit payment
        transaction_page.submit_payment()

        # Verify "Paid" text is visible on the confirmation screen
        assert transaction_page.is_paid_text_visible()

        # Verify return-to-transactions button is visible
        assert transaction_page.is_return_button_visible()

    def test_create_request(self, driver, base_url):
        """A user should be able to create a payment request."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        transaction_page.wait_for_user_list()
        transaction_page.select_first_user()

        # Fill transaction details
        transaction_page.fill_amount("50")
        transaction_page.fill_description("Test request")

        # Submit request
        transaction_page.submit_request()

        # Verify "Requested" text is visible on the confirmation screen
        assert transaction_page.is_requested_text_visible()

    def test_zero_amount(self, driver, base_url):
        """A transaction with zero amount should not be allowed."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        transaction_page.wait_for_user_list()
        transaction_page.select_first_user()

        # Enter zero as the amount
        transaction_page.fill_amount("0")
        transaction_page.fill_description("Zero amount test")

        # Pay and Request buttons should be disabled with zero amount
        assert transaction_page.is_pay_button_disabled()
        assert transaction_page.is_request_button_disabled()

    def test_empty_description(self, driver, base_url):
        """A transaction without a description should not be allowed."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        transaction_page.wait_for_user_list()
        transaction_page.select_first_user()

        # Enter a valid amount but leave description empty
        transaction_page.fill_amount("25")

        # Pay and Request buttons should be disabled without a description
        assert transaction_page.is_pay_button_disabled()
        assert transaction_page.is_request_button_disabled()

    def test_transaction_detail_after_creation(self, driver, base_url):
        """After creating a payment, returning to the list should show the transaction."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        transaction_page.wait_for_user_list()
        transaction_page.select_first_user()

        # Fill transaction details
        transaction_page.fill_amount("10")
        transaction_page.fill_description("Detail verification payment")

        # Submit payment
        transaction_page.submit_payment()

        # Verify confirmation screen
        assert transaction_page.is_paid_text_visible()

        # Return to transactions list
        transaction_page.click_return_to_transactions()

        # Navigate to personal tab to see the transaction
        transaction_page.click_personal_tab()

        # Verify the transaction list is visible
        assert transaction_page.is_transaction_list_visible()
