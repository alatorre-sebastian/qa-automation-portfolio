"""Login Page Object for Selenium tests.

Encapsulates selectors and actions for the /signin page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from pages.base_page import BasePage


class LoginPage(BasePage):
    """Page object for the login (signin) page."""

    # Selectors matching the Playwright page objects
    USERNAME_INPUT = (By.CSS_SELECTOR, '[data-test="signin-username"] input')
    PASSWORD_INPUT = (By.CSS_SELECTOR, '[data-test="signin-password"] input')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-test="signin-submit"]')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '[data-test="signin-error"]')
    SIDENAV_USERNAME = (By.CSS_SELECTOR, '[data-test="sidenav-username"]')
    USERNAME_HELPER_TEXT = (By.CSS_SELECTOR, '#username-helper-text')
    PASSWORD_HELPER_TEXT = (By.CSS_SELECTOR, '#password-helper-text')

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

    def fill_login_form_and_submit(self, username: str, password: str) -> None:
        """Fill the login form and submit (without navigating)."""
        self.fill_username(username)
        self.fill_password(password)
        self.submit()

    def clear_username_and_blur(self) -> None:
        """Clear the username field and blur to trigger validation."""
        element = self.find_element(*self.USERNAME_INPUT)
        self._set_input_value_and_blur(element, "")

    def fill_password_and_blur(self, password: str) -> None:
        """Fill the password field and blur to trigger validation."""
        element = self.find_element(*self.PASSWORD_INPUT)
        self._set_input_value_and_blur(element, password)

    def get_username_helper_text(self) -> str:
        """Get the username validation helper text."""
        return self.get_text(*self.USERNAME_HELPER_TEXT)

    def get_password_helper_text(self) -> str:
        """Get the password validation helper text."""
        return self.get_text(*self.PASSWORD_HELPER_TEXT)

    def is_username_helper_visible(self) -> bool:
        """Check if the username helper text is visible."""
        return self.is_visible(*self.USERNAME_HELPER_TEXT)

    def is_password_helper_visible(self) -> bool:
        """Check if the password helper text is visible."""
        return self.is_visible(*self.PASSWORD_HELPER_TEXT)

    def is_submit_disabled(self) -> bool:
        """Check if the submit button is disabled."""
        element = self.find_element(*self.SUBMIT_BUTTON)
        return not element.is_enabled()

    def is_sidenav_username_visible(self) -> bool:
        """Check if the sidenav username element is visible."""
        return self.is_visible(*self.SIDENAV_USERNAME)

    def get_sidenav_username_text(self) -> str:
        """Get the text of the sidenav username element."""
        return self.get_text(*self.SIDENAV_USERNAME)
