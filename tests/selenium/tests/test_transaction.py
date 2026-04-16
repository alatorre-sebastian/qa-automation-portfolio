"""Transaction E2E tests for Selenium.

Mirrors the Playwright transaction.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import pytest
from selenium.webdriver.common.by import By
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
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, '[data-test="sidenav-username"]')
        )
    )


@pytest.mark.transaction
class TestTransaction:
    """Tests for creating transactions (payments and requests)."""

    def test_create_payment(self, driver, base_url):
        """A user should be able to create a payment transaction."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test^="user-list-item-"]')
            )
        )
        transaction_page.select_first_user()

        # Fill transaction details
        transaction_page.fill_amount("25")
        transaction_page.fill_description("Test payment")

        # Submit payment
        transaction_page.submit_payment()

        # Verify "Paid" text is visible on the confirmation screen
        paid_text = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Paid')]")
            )
        )
        assert paid_text.is_displayed()

        # Verify return-to-transactions button is visible
        return_button = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="new-transaction-return-to-transactions"]')
            )
        )
        assert return_button.is_displayed()

    def test_create_request(self, driver, base_url):
        """A user should be able to create a payment request."""
        _login(driver)

        transaction_page = TransactionPage(driver)
        transaction_page.navigate_to_new_transaction()

        # Wait for user list to load and select the first user
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test^="user-list-item-"]')
            )
        )
        transaction_page.select_first_user()

        # Fill transaction details
        transaction_page.fill_amount("50")
        transaction_page.fill_description("Test request")

        # Submit request
        transaction_page.submit_request()

        # Verify "Requested" text is visible on the confirmation screen
        requested_text = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Requested')]")
            )
        )
        assert requested_text.is_displayed()
