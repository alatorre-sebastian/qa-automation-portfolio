"""Login E2E tests for Selenium.

Mirrors the Playwright login.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage


@pytest.mark.login
class TestLogin:
    """Tests for the login (signin) functionality."""

    def test_redirect_unauthenticated_user_to_signin(self, driver, base_url):
        """An unauthenticated user navigating to /personal should be redirected to /signin."""
        driver.get(f"{base_url}/personal")
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
        assert "/signin" in driver.current_url

    def test_successful_login(self, driver, base_url):
        """A user should be able to login with valid credentials."""
        login_page = LoginPage(driver)
        login_page.navigate()
        login_page.fill_username("Heath93")
        login_page.fill_password("s3cret")
        login_page.submit()

        # The AUT performs window.location.pathname = "/" after successful login,
        # causing a full page reload. Wait for URL to NOT contain /signin.
        WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))

        # Verify the sidenav shows the username
        assert login_page.is_sidenav_username_visible()
        assert "Heath93" in login_page.get_sidenav_username_text()

    def test_invalid_credentials(self, driver, base_url):
        """Logging in with invalid credentials should display an error message."""
        login_page = LoginPage(driver)
        login_page.navigate()
        login_page.fill_username("invalidUser")
        login_page.fill_password("invalidPassword")
        login_page.submit()

        error_message = login_page.get_error_message()
        assert "Username or password is invalid" in error_message

    def test_show_validation_errors(self, driver, base_url):
        """Validation errors should appear for empty username and short password."""
        login_page = LoginPage(driver)
        login_page.navigate()

        # Type and clear username to trigger validation
        login_page.fill_username("User")
        login_page.clear_username_and_blur()
        assert login_page.is_username_helper_visible()
        assert "Username is required" in login_page.get_username_helper_text()

        # Type short password to trigger validation
        login_page.fill_password_and_blur("abc")
        assert login_page.is_password_helper_visible()
        assert "Password must contain at least 4 characters" in login_page.get_password_helper_text()

        # Verify submit button is disabled
        assert login_page.is_submit_disabled()

    def test_empty_credentials_stays_on_signin(self, driver, base_url):
        """Clicking submit with empty credentials should keep user on signin page."""
        login_page = LoginPage(driver)
        login_page.navigate()

        # Click submit without filling any fields
        login_page.submit()

        # User should remain on the signin page
        assert "/signin" in driver.current_url

    def test_logout_and_redirect_to_signin(self, driver, base_url):
        """After logging in, clicking logout should redirect to the signin page."""
        login_page = LoginPage(driver)
        login_page.navigate()
        login_page.fill_username("Heath93")
        login_page.fill_password("s3cret")
        login_page.submit()

        WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))
        assert login_page.is_sidenav_username_visible()

        # Click logout
        login_page.click_logout()

        # Verify redirect to signin page
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
        assert "/signin" in driver.current_url
