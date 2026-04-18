"""Bank Account Page Object for Selenium tests.

Encapsulates selectors and actions for the bank accounts page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class BankAccountPage(BasePage):
    """Page object for the bank accounts page."""

    SIDENAV_LINK = (By.CSS_SELECTOR, '[data-test="sidenav-bankaccounts"]')
    BANK_ACCOUNT_LIST = (By.CSS_SELECTOR, '[data-test="bankaccount-list"]')
    BANK_ACCOUNT_ITEMS = (By.CSS_SELECTOR, '[data-test^="bankaccount-list-item-"]')
    CREATE_NEW_BUTTON = (By.CSS_SELECTOR, '[data-test="bankaccount-new"]')
    BANK_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-bankName-input"] input')
    ACCOUNT_NUMBER_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-accountNumber-input"] input')
    ROUTING_NUMBER_INPUT = (By.CSS_SELECTOR, '[data-test="bankaccount-routingNumber-input"] input')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-test="bankaccount-submit"]')
    DELETE_BUTTONS = (By.CSS_SELECTOR, '[data-test="bankaccount-delete"]')
    DELETED_TEXT = (By.XPATH, "//*[contains(text(), '(Deleted)')]")

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate(self) -> None:
        """Navigate to bank accounts via the sidenav link."""
        self.click(*self.SIDENAV_LINK)

    def is_bank_account_list_visible(self) -> bool:
        """Check if the bank account list is visible."""
        return self.is_visible(*self.BANK_ACCOUNT_LIST)

    def get_bank_account_count(self) -> int:
        """Return the number of bank account items."""
        items = self.find_elements(*self.BANK_ACCOUNT_ITEMS)
        return len(items)

    def click_create_new(self) -> None:
        """Click the create new bank account button."""
        self.click(*self.CREATE_NEW_BUTTON)

    def fill_bank_name(self, name: str) -> None:
        """Type a bank name into the bank name input."""
        self.type_text(*self.BANK_NAME_INPUT, name)

    def fill_account_number(self, account_number: str) -> None:
        """Type an account number into the account number input."""
        self.type_text(*self.ACCOUNT_NUMBER_INPUT, account_number)

    def fill_routing_number(self, routing_number: str) -> None:
        """Type a routing number into the routing number input."""
        self.type_text(*self.ROUTING_NUMBER_INPUT, routing_number)

    def submit(self) -> None:
        """Click the submit button."""
        self.click(*self.SUBMIT_BUTTON)

    def delete_first_account(self) -> None:
        """Click the delete button on the first bank account."""
        self.click(*self.DELETE_BUTTONS)

    def is_deleted_text_visible(self) -> bool:
        """Check if the '(Deleted)' text is visible."""
        return self.is_visible(*self.DELETED_TEXT)
