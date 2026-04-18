"""User Settings Page Object for Selenium tests.

Encapsulates selectors and actions for the user settings page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from pages.base_page import BasePage


class UserSettingsPage(BasePage):
    """Page object for the user settings page."""

    SIDENAV_USER_SETTINGS_LINK = (By.CSS_SELECTOR, '[data-test="sidenav-user-settings"]')
    FIRST_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="user-settings-firstName-input"]')
    LAST_NAME_INPUT = (By.CSS_SELECTOR, '[data-test="user-settings-lastName-input"]')
    EMAIL_INPUT = (By.CSS_SELECTOR, '[data-test="user-settings-email-input"]')
    PHONE_NUMBER_INPUT = (By.CSS_SELECTOR, '[data-test="user-settings-phoneNumber-input"]')
    SAVE_BUTTON = (By.CSS_SELECTOR, '[data-test="user-settings-submit"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate(self) -> None:
        """Navigate to user settings via the sidenav link."""
        self.click(*self.SIDENAV_USER_SETTINGS_LINK)

    def fill_first_name(self, first_name: str) -> None:
        """Clear and type a first name into the first name input."""
        element = self.find_element(*self.FIRST_NAME_INPUT)
        self._set_input_value_and_blur(element, first_name)

    def fill_last_name(self, last_name: str) -> None:
        """Clear and type a last name into the last name input."""
        element = self.find_element(*self.LAST_NAME_INPUT)
        self._set_input_value_and_blur(element, last_name)

    def fill_email(self, email: str) -> None:
        """Clear and type an email into the email input."""
        element = self.find_element(*self.EMAIL_INPUT)
        self._set_input_value_and_blur(element, email)

    def fill_phone_number(self, phone_number: str) -> None:
        """Clear and type a phone number into the phone number input."""
        element = self.find_element(*self.PHONE_NUMBER_INPUT)
        self._set_input_value_and_blur(element, phone_number)

    def save(self) -> None:
        """Click the save button."""
        self.click(*self.SAVE_BUTTON)

    def fill_settings_form_and_save(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone_number: str,
    ) -> None:
        """Fill all user settings fields and save."""
        self.fill_first_name(first_name)
        self.fill_last_name(last_name)
        self.fill_email(email)
        self.fill_phone_number(phone_number)
        self.save()

    def get_first_name_value(self) -> str:
        """Get the current value of the first name input."""
        return self.find_element(*self.FIRST_NAME_INPUT).get_attribute("value") or ""

    def get_last_name_value(self) -> str:
        """Get the current value of the last name input."""
        return self.find_element(*self.LAST_NAME_INPUT).get_attribute("value") or ""

    def get_email_value(self) -> str:
        """Get the current value of the email input."""
        return self.find_element(*self.EMAIL_INPUT).get_attribute("value") or ""

    def get_phone_number_value(self) -> str:
        """Get the current value of the phone number input."""
        return self.find_element(*self.PHONE_NUMBER_INPUT).get_attribute("value") or ""

    def is_first_name_visible(self) -> bool:
        """Check if the first name input is visible."""
        return self.is_visible(*self.FIRST_NAME_INPUT)

    def is_last_name_visible(self) -> bool:
        """Check if the last name input is visible."""
        return self.is_visible(*self.LAST_NAME_INPUT)

    def is_email_visible(self) -> bool:
        """Check if the email input is visible."""
        return self.is_visible(*self.EMAIL_INPUT)

    def is_phone_number_visible(self) -> bool:
        """Check if the phone number input is visible."""
        return self.is_visible(*self.PHONE_NUMBER_INPUT)
