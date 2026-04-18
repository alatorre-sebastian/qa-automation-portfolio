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
    FIRST_NAME_HELPER = (By.CSS_SELECTOR, '#firstName-helper-text')
    LAST_NAME_HELPER = (By.CSS_SELECTOR, '#lastName-helper-text')
    USERNAME_HELPER = (By.CSS_SELECTOR, '#username-helper-text')
    PASSWORD_HELPER = (By.CSS_SELECTOR, '#password-helper-text')
    CONFIRM_PASSWORD_HELPER = (By.CSS_SELECTOR, '#confirmPassword-helper-text')

    def __init__(self, driver):
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

    def fill_signup_form_and_submit(
        self,
        first_name: str,
        last_name: str,
        username: str,
        password: str,
        confirm_password: str,
    ) -> None:
        """Fill the entire signup form and submit."""
        self.fill_first_name(first_name)
        self.fill_last_name(last_name)
        self.fill_username(username)
        self.fill_password(password)
        self.fill_confirm_password(confirm_password)
        self.submit()

    def get_title(self) -> str:
        """Get the text of the signup page title."""
        return self.get_text(*self.TITLE)

    def clear_first_name_and_blur(self) -> None:
        """Clear the first name field and blur to trigger validation."""
        element = self.find_element(*self.FIRST_NAME_INPUT)
        self._set_input_value_and_blur(element, "")

    def clear_last_name_and_blur(self) -> None:
        """Clear the last name field and blur to trigger validation."""
        element = self.find_element(*self.LAST_NAME_INPUT)
        self._set_input_value_and_blur(element, "")

    def clear_username_and_blur(self) -> None:
        """Clear the username field and blur to trigger validation."""
        element = self.find_element(*self.USERNAME_INPUT)
        self._set_input_value_and_blur(element, "")

    def clear_password_and_blur(self) -> None:
        """Clear the password field and blur to trigger validation."""
        element = self.find_element(*self.PASSWORD_INPUT)
        self._set_input_value_and_blur(element, "")

    def fill_confirm_password_and_blur(self, confirm_password: str) -> None:
        """Fill the confirm password field and blur to trigger validation."""
        element = self.find_element(*self.CONFIRM_PASSWORD_INPUT)
        self._set_input_value_and_blur(element, confirm_password)

    def get_first_name_helper_text(self) -> str:
        """Get the first name validation helper text."""
        return self.get_text(*self.FIRST_NAME_HELPER)

    def get_last_name_helper_text(self) -> str:
        """Get the last name validation helper text."""
        return self.get_text(*self.LAST_NAME_HELPER)

    def get_username_helper_text(self) -> str:
        """Get the username validation helper text."""
        return self.get_text(*self.USERNAME_HELPER)

    def get_password_helper_text(self) -> str:
        """Get the password validation helper text."""
        return self.get_text(*self.PASSWORD_HELPER)

    def get_confirm_password_helper_text(self) -> str:
        """Get the confirm password validation helper text."""
        return self.get_text(*self.CONFIRM_PASSWORD_HELPER)

    def is_first_name_helper_visible(self) -> bool:
        """Check if the first name helper text is visible."""
        return self.is_visible(*self.FIRST_NAME_HELPER)

    def is_last_name_helper_visible(self) -> bool:
        """Check if the last name helper text is visible."""
        return self.is_visible(*self.LAST_NAME_HELPER)

    def is_username_helper_visible(self) -> bool:
        """Check if the username helper text is visible."""
        return self.is_visible(*self.USERNAME_HELPER)

    def is_password_helper_visible(self) -> bool:
        """Check if the password helper text is visible."""
        return self.is_visible(*self.PASSWORD_HELPER)

    def is_confirm_password_helper_visible(self) -> bool:
        """Check if the confirm password helper text is visible."""
        return self.is_visible(*self.CONFIRM_PASSWORD_HELPER)

    def is_submit_disabled(self) -> bool:
        """Check if the submit button is disabled."""
        element = self.find_element(*self.SUBMIT_BUTTON)
        return not element.is_enabled()
