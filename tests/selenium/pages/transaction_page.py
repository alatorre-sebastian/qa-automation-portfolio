"""Transaction Page Object for Selenium tests.

Encapsulates selectors and actions for creating transactions in the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class TransactionPage(BasePage):
    """Page object for the new transaction flow."""

    # Selectors matching the Playwright page objects
    NEW_TRANSACTION_BUTTON = (By.CSS_SELECTOR, '[data-test="nav-top-new-transaction"]')
    USER_SEARCH_INPUT = (By.CSS_SELECTOR, '[data-test="user-list-search-input"]')
    AMOUNT_INPUT = (By.CSS_SELECTOR, '[data-test="transaction-create-amount-input"] #amount')
    DESCRIPTION_INPUT = (By.CSS_SELECTOR, '[data-test="transaction-create-description-input"] input')
    PAY_BUTTON = (By.CSS_SELECTOR, '[data-test="transaction-create-submit-payment"]')
    REQUEST_BUTTON = (By.CSS_SELECTOR, '[data-test="transaction-create-submit-request"]')
    RETURN_TO_TRANSACTIONS_BUTTON = (By.CSS_SELECTOR, '[data-test="new-transaction-return-to-transactions"]')
    USER_LIST_ITEMS = (By.CSS_SELECTOR, '[data-test^="user-list-item-"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate_to_new_transaction(self) -> None:
        """Click the new transaction button in the top nav."""
        self.click(*self.NEW_TRANSACTION_BUTTON)

    def search_for_user(self, query: str) -> None:
        """Type a search query into the user search input."""
        self.type_text(*self.USER_SEARCH_INPUT, query)

    def select_first_user(self) -> None:
        """Click the first user in the user list."""
        self.click(*self.USER_LIST_ITEMS)

    def fill_amount(self, amount: str) -> None:
        """Type an amount into the amount input field."""
        self.type_text(*self.AMOUNT_INPUT, amount)

    def fill_description(self, description: str) -> None:
        """Type a description into the description input field."""
        self.type_text(*self.DESCRIPTION_INPUT, description)

    def submit_payment(self) -> None:
        """Click the pay button to submit a payment."""
        self.click(*self.PAY_BUTTON)

    def submit_request(self) -> None:
        """Click the request button to submit a payment request."""
        self.click(*self.REQUEST_BUTTON)
