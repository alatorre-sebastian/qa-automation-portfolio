"""Login E2E tests for Selenium.

Mirrors the Playwright login.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import pytest
from selenium.webdriver.common.by import By
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
        sidenav_username = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="sidenav-username"]')
            )
        )
        assert "Heath93" in sidenav_username.text

    def test_invalid_credentials(self, driver, base_url):
        """Logging in with invalid credentials should display an error message."""
        login_page = LoginPage(driver)
        login_page.navigate()
        login_page.fill_username("invalidUser")
        login_page.fill_password("invalidPassword")
        login_page.submit()

        error_message = login_page.get_error_message()
        assert "Username or password is invalid" in error_message
