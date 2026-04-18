"""Bank Account E2E tests for Selenium.

UI tests for bank account management using the BankAccountPage page object.
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.bank_account_page import BankAccountPage


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


@pytest.mark.bankaccount
class TestBankAccount:
    """Tests for bank account management."""

    def test_display_bank_accounts(self, driver, base_url):
        """The bank accounts page should display a list of accounts."""
        _login(driver)

        bank_account_page = BankAccountPage(driver)
        bank_account_page.navigate()

        assert bank_account_page.is_bank_account_list_visible()
        assert bank_account_page.get_bank_account_count() >= 1

    def test_create_bank_account(self, driver, base_url):
        """A user should be able to create a new bank account."""
        _login(driver)

        bank_account_page = BankAccountPage(driver)
        bank_account_page.navigate()

        assert bank_account_page.is_bank_account_list_visible()
        initial_count = bank_account_page.get_bank_account_count()

        # Create a new bank account
        bank_account_page.click_create_new()
        bank_account_page.fill_bank_name("Test Bank")
        bank_account_page.fill_account_number("123456789")
        bank_account_page.fill_routing_number("987654321")
        bank_account_page.submit()

        # Verify the new account appears in the list
        assert bank_account_page.is_bank_account_list_visible()
        assert bank_account_page.get_bank_account_count() == initial_count + 1

    def test_delete_bank_account(self, driver, base_url):
        """A user should be able to delete a bank account (soft delete)."""
        _login(driver)

        bank_account_page = BankAccountPage(driver)
        bank_account_page.navigate()

        assert bank_account_page.is_bank_account_list_visible()

        # Delete the first account
        bank_account_page.delete_first_account()

        # Verify the account is marked as deleted
        assert bank_account_page.is_deleted_text_visible()
