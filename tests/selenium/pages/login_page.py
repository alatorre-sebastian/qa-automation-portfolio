"""Login Page Object for Selenium tests.

Encapsulates selectors and actions for the /signin page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class LoginPage(BasePage):
    """Page object for the login (signin) page."""

    # Selectors matching the Playwright page objects
    USERNAME_INPUT = (By.CSS_SELECTOR, '[data-test="signin-username"] input')
    PASSWORD_INPUT = (By.CSS_SELECTOR, '[data-test="signin-password"] input')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-test="signin-submit"]')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '[data-test="signin-error"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate(self) -> None:
        """Navigate to the signin page."""
        super().navigate("/signin")

    def fill_username(self, username: str) -> None:
        """Type a username into the username field."""
        self.type_text(*self.USERNAME_INPUT, username)

    def fill_password(self, password: str) -> None:
        """Type a password into the password field."""
        self.type_text(*self.PASSWORD_INPUT, password)

    def submit(self) -> None:
        """Click the sign-in submit button."""
        self.click(*self.SUBMIT_BUTTON)

    def get_error_message(self) -> str:
        """Get the text of the sign-in error message."""
        return self.get_text(*self.ERROR_MESSAGE)

    def login(self, username: str, password: str) -> None:
        """Convenience method: navigate, fill credentials, and submit."""
        self.navigate()
        self.fill_username(username)
        self.fill_password(password)
        self.submit()
