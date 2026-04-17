"""Onboarding Page Object for Selenium tests.

Encapsulates selectors and actions for the new-user onboarding dialog in the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class OnboardingPage(BasePage):
    """Page object for the new-user onboarding dialog."""

    DIALOG = (By.CSS_SELECTOR, '[data-test="user-onboarding-dialog"]')
    DIALOG_TITLE = (By.CSS_SELECTOR, '[data-test="user-onboarding-dialog-title"]')
    NEXT_BUTTON = (By.CSS_SELECTOR, '[data-test="user-onboarding-next"]')
    BANK_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-bankName-input"] input')
    ACCOUNT_NUMBER_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-accountNumber-input"] input')
    ROUTING_NUMBER_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-routingNumber-input"] input')
    BANK_ACCOUNT_SUBMIT = (By.CSS_SELECTOR, '[data-test="bankaccount-submit"]')
    TRANSACTION_LIST = (By.CSS_SELECTOR, '[data-test="transaction-list"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def is_dialog_visible(self) -> bool:
        """Check if the onboarding dialog is visible."""
        return self.is_visible(*self.DIALOG)

    def click_next(self) -> None:
        """Click the Next/Done button in the onboarding dialog."""
        self.click(*self.NEXT_BUTTON)

    def get_dialog_title_text(self) -> str:
        """Get the text of the onboarding dialog title."""
        return self.get_text(*self.DIALOG_TITLE)

    def fill_bank_name(self, name: str) -> None:
        """Fill the bank name input."""
        self.type_text(*self.BANK_NAME_INPUT, name)

    def fill_account_number(self, account_number: str) -> None:
        """Fill the account number input."""
        self.type_text(*self.ACCOUNT_NUMBER_INPUT, account_number)

    def fill_routing_number(self, routing_number: str) -> None:
        """Fill the routing number input."""
        self.type_text(*self.ROUTING_NUMBER_INPUT, routing_number)

    def submit_bank_account(self) -> None:
        """Click the bank account submit button."""
        self.click(*self.BANK_ACCOUNT_SUBMIT)

    def is_transaction_list_visible(self) -> bool:
        """Check if the transaction list is visible after onboarding."""
        return self.is_visible(*self.TRANSACTION_LIST)
