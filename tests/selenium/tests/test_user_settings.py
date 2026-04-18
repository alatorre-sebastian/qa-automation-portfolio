"""User Settings E2E tests for Selenium.

Mirrors the Playwright user-settings.spec.ts tests adapted for Selenium/pytest.
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.user_settings_page import UserSettingsPage


def _login(driver: object) -> None:
    """Helper: log in with the default test user before each test."""
    login_page = LoginPage(driver)
    login_page.navigate()
    login_page.fill_username("Heath93")
    login_page.fill_password("s3cret")
    login_page.submit()

    WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))
    assert login_page.is_sidenav_username_visible()


@pytest.mark.usersettings
class TestUserSettings:
    """Tests for the user settings functionality."""

    def test_navigate_to_user_settings(self, driver, base_url):
        """Should navigate to user settings and see all fields."""
        _login(driver)

        settings_page = UserSettingsPage(driver)
        settings_page.navigate()

        assert settings_page.is_first_name_visible()
        assert settings_page.is_last_name_visible()
        assert settings_page.is_email_visible()
        assert settings_page.is_phone_number_visible()

    def test_update_first_name_and_last_name(self, driver, base_url):
        """Should update first name and last name and verify persistence."""
        _login(driver)

        settings_page = UserSettingsPage(driver)
        settings_page.navigate()

        settings_page.fill_first_name("UpdatedFirst")
        settings_page.fill_last_name("UpdatedLast")
        settings_page.save()

        # Navigate back to settings and verify changes persist
        settings_page.navigate()
        assert settings_page.get_first_name_value() == "UpdatedFirst"
        assert settings_page.get_last_name_value() == "UpdatedLast"

    def test_update_email(self, driver, base_url):
        """Should update email and verify persistence."""
        _login(driver)

        settings_page = UserSettingsPage(driver)
        settings_page.navigate()

        settings_page.fill_email("updated@example.com")
        settings_page.save()

        # Navigate back to settings and verify changes persist
        settings_page.navigate()
        assert settings_page.get_email_value() == "updated@example.com"

    def test_update_phone_number(self, driver, base_url):
        """Should update phone number and verify persistence."""
        _login(driver)

        settings_page = UserSettingsPage(driver)
        settings_page.navigate()

        settings_page.fill_phone_number("555-123-4567")
        settings_page.save()

        # Navigate back to settings and verify changes persist
        settings_page.navigate()
        assert settings_page.get_phone_number_value() == "555-123-4567"

    def test_update_all_settings_and_verify_persistence(self, driver, base_url):
        """Should update all settings and verify they persist after navigation."""
        _login(driver)

        settings_page = UserSettingsPage(driver)
        settings_page.navigate()

        settings_page.fill_settings_form_and_save(
            first_name="NewFirst",
            last_name="NewLast",
            email="newuser@test.com",
            phone_number="555-999-0000",
        )

        # Navigate back to settings and verify all changes persist
        settings_page.navigate()
        assert settings_page.get_first_name_value() == "NewFirst"
        assert settings_page.get_last_name_value() == "NewLast"
        assert settings_page.get_email_value() == "newuser@test.com"
        assert settings_page.get_phone_number_value() == "555-999-0000"
