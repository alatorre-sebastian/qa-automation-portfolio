"""Transaction Page Object for Selenium tests.

Encapsulates selectors and actions for creating transactions in the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

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
    PERSONAL_TAB = (By.CSS_SELECTOR, '[data-test="nav-personal-tab"]')
    TRANSACTION_LIST = (By.CSS_SELECTOR, '[data-test="transaction-list"]')
    PAID_TEXT = (By.XPATH, "//*[contains(text(), 'Paid')]")
    REQUESTED_TEXT = (By.XPATH, "//*[contains(text(), 'Requested')]")

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

    def wait_for_user_list(self) -> None:
        """Wait for the user list items to be visible."""
        self.is_visible(*self.USER_LIST_ITEMS)

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

    def click_return_to_transactions(self) -> None:
        """Click the return to transactions button."""
        self.click(*self.RETURN_TO_TRANSACTIONS_BUTTON)

    def is_return_button_visible(self) -> bool:
        """Check if the return to transactions button is visible."""
        return self.is_visible(*self.RETURN_TO_TRANSACTIONS_BUTTON)

    def is_paid_text_visible(self) -> bool:
        """Check if the 'Paid' confirmation text is visible."""
        return self.is_visible(*self.PAID_TEXT)

    def is_requested_text_visible(self) -> bool:
        """Check if the 'Requested' confirmation text is visible."""
        return self.is_visible(*self.REQUESTED_TEXT)

    def is_pay_button_disabled(self) -> bool:
        """Check if the pay button is disabled."""
        element = self.find_element(*self.PAY_BUTTON)
        return not element.is_enabled()

    def is_request_button_disabled(self) -> bool:
        """Check if the request button is disabled."""
        element = self.find_element(*self.REQUEST_BUTTON)
        return not element.is_enabled()

    def click_personal_tab(self) -> None:
        """Click the personal transactions tab."""
        self.click(*self.PERSONAL_TAB)

    def is_transaction_list_visible(self) -> bool:
        """Check if the transaction list is visible."""
        return self.is_visible(*self.TRANSACTION_LIST)
