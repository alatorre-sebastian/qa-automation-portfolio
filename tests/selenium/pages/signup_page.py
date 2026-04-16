"""Sign Up Page Object for Selenium tests.

Encapsulates selectors and actions for the /signup page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class SignUpPage(BasePage):
    """Page object for the sign-up page."""

    # Selectors matching the Playwright page objects
    FIRST_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="signup-first-name"] input')
    LAST_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="signup-last-name"] input')
    USERNAME_INPUT = (By.CSS_SELECTOR, '[data-test="signup-username"] input')
    PASSWORD_INPUT = (By.CSS_SELECTOR, '[data-test="signup-password"] input')
    CONFIRM_PASSWORD_INPUT = (By.CSS_SELECTOR, '[data-test="signup-confirmPassword"] input')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-test="signup-submit"]')
    TITLE = (By.CSS_SELECTOR, '[data-test="signup-title"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate(self) -> None:
        """Navigate to the signup page."""
        super().navigate("/signup")

    def fill_first_name(self, first_name: str) -> None:
        """Type a first name into the first name field."""
        self.type_text(*self.FIRST_NAME_INPUT, first_name)

    def fill_last_name(self, last_name: str) -> None:
        """Type a last name into the last name field."""
        self.type_text(*self.LAST_NAME_INPUT, last_name)

    def fill_username(self, username: str) -> None:
        """Type a username into the username field."""
        self.type_text(*self.USERNAME_INPUT, username)

    def fill_password(self, password: str) -> None:
        """Type a password into the password field."""
        self.type_text(*self.PASSWORD_INPUT, password)

    def fill_confirm_password(self, confirm_password: str) -> None:
        """Type a password into the confirm password field."""
        self.type_text(*self.CONFIRM_PASSWORD_INPUT, confirm_password)

    def submit(self) -> None:
        """Click the sign-up submit button."""
        self.click(*self.SUBMIT_BUTTON)

    def get_title(self) -> str:
        """Get the text of the signup page title."""
        return self.get_text(*self.TITLE)
