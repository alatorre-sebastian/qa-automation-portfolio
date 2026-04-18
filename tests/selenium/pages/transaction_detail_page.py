"""Transaction Detail Page Object for Selenium tests.

Encapsulates selectors and actions for the transaction detail view,
including likes and comments functionality.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from pages.base_page import BasePage


class TransactionDetailPage(BasePage):
    """Page object for the transaction detail view (likes & comments)."""

    TRANSACTION_ITEMS = (By.CSS_SELECTOR, '[data-test^="transaction-item-"]')
    LIKE_BUTTON = (By.CSS_SELECTOR, '[data-test^="transaction-like-button-"]')
    LIKE_COUNT = (By.CSS_SELECTOR, '[data-test^="transaction-like-count-"]')
    COMMENT_INPUT = (By.CSS_SELECTOR, '[data-test^="transaction-comment-input-"]')
    COMMENT_LIST_ITEMS = (By.CSS_SELECTOR, '[data-test^="comment-list-item-"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def get_transaction_items(self) -> list[WebElement]:
        """Return a list of transaction item elements."""
        return self.find_elements(*self.TRANSACTION_ITEMS)

    def click_first_transaction(self) -> None:
        """Click the first transaction in the list."""
        self.click(*self.TRANSACTION_ITEMS)

    def is_like_button_visible(self) -> bool:
        """Check if the like button is visible."""
        return self.is_visible(*self.LIKE_BUTTON)

    def click_like_button(self) -> None:
        """Click the like button."""
        self.click(*self.LIKE_BUTTON)

    def get_like_count_text(self) -> str:
        """Get the text of the like count element."""
        try:
            return self.get_text(*self.LIKE_COUNT)
        except Exception:
            return "0"

    def get_like_count(self) -> int:
        """Get the numeric like count."""
        text = self.get_like_count_text()
        try:
            return int(text)
        except ValueError:
            return 0

    def is_comment_input_visible(self) -> bool:
        """Check if the comment input is visible."""
        return self.is_visible(*self.COMMENT_INPUT)

    def add_comment(self, comment: str) -> None:
        """Type a comment and press Enter to submit."""
        element = self.find_element(*self.COMMENT_INPUT)
        element.clear()
        element.send_keys(comment)
        element.send_keys(Keys.ENTER)

    def get_comment_items(self) -> list[WebElement]:
        """Return a list of comment item elements."""
        return self.find_elements(*self.COMMENT_LIST_ITEMS)

    def get_comment_count(self) -> int:
        """Return the number of comment items."""
        try:
            items = self.driver.find_elements(*self.COMMENT_LIST_ITEMS)
            return len(items)
        except Exception:
            return 0
