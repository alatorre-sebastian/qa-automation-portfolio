"""Sign Up E2E tests for Selenium.

Mirrors the Playwright signup.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import time

import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.signup_page import SignUpPage
from pages.login_page import LoginPage
from pages.onboarding_page import OnboardingPage


@pytest.mark.signup
class TestSignUp:
    """Tests for the sign-up functionality."""

    def test_signup_new_user(self, driver, base_url):
        """A visitor should be able to sign up, complete onboarding, and see transactions."""
        signup_page = SignUpPage(driver)
        signup_page.navigate()

        # Fill sign-up form with a unique username
        unique_username = f"TestUser{int(time.time())}"
        signup_page.fill_first_name("Bob")
        signup_page.fill_last_name("Ross")
        signup_page.fill_username(unique_username)
        signup_page.fill_password("s3cret")
        signup_page.fill_confirm_password("s3cret")
        signup_page.submit()

        # After signup, user is redirected to /signin
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))

        # Login with the new credentials
        login_page = LoginPage(driver)
        login_page.fill_username(unique_username)
        login_page.fill_password("s3cret")
        login_page.submit()

        # After login the app performs a full page reload.
        # Wait for the URL to change away from /signin.
        WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))

        # Wait for sidenav username to confirm we are logged in
        assert login_page.is_sidenav_username_visible()

        # Onboarding dialog appears for new users
        onboarding_page = OnboardingPage(driver)
        assert onboarding_page.is_dialog_visible()

        # Step 1: Click Next
        onboarding_page.click_next()

        # Step 2: Fill bank account form
        onboarding_page.fill_bank_name("The Best Bank")
        onboarding_page.fill_account_number("123456789")
        onboarding_page.fill_routing_number("987654321")
        onboarding_page.submit_bank_account()

        # Step 3: Finished — click Done
        onboarding_page.click_next()

        # Verify transaction list is visible after onboarding
        assert onboarding_page.is_transaction_list_visible()

    def test_show_validation_errors_on_signup(self, driver, base_url):
        """Validation errors should appear for empty fields and password mismatch."""
        signup_page = SignUpPage(driver)
        signup_page.navigate()

        # Fill and clear first name to trigger validation
        signup_page.fill_first_name("First")
        signup_page.clear_first_name_and_blur()
        assert signup_page.is_first_name_helper_visible()
        assert "First Name is required" in signup_page.get_first_name_helper_text()

        # Fill and clear last name
        signup_page.fill_last_name("Last")
        signup_page.clear_last_name_and_blur()
        assert signup_page.is_last_name_helper_visible()
        assert "Last Name is required" in signup_page.get_last_name_helper_text()

        # Fill and clear username
        signup_page.fill_username("User")
        signup_page.clear_username_and_blur()
        assert signup_page.is_username_helper_visible()
        assert "Username is required" in signup_page.get_username_helper_text()

        # Fill and clear password
        signup_page.fill_password("password")
        signup_page.clear_password_and_blur()
        assert signup_page.is_password_helper_visible()
        assert "Enter your password" in signup_page.get_password_helper_text()

        # Fill confirm password with mismatch
        signup_page.fill_password("password")
        signup_page.fill_confirm_password_and_blur("DIFFERENT PASSWORD")
        assert signup_page.is_confirm_password_helper_visible()
        assert "Password does not match" in signup_page.get_confirm_password_helper_text()

        # Submit button should be disabled
        assert signup_page.is_submit_disabled()

    def test_duplicate_username(self, driver, base_url):
        """Signing up with an existing username should keep user on signup page."""
        signup_page = SignUpPage(driver)
        signup_page.navigate()

        # Try to register with an existing username
        signup_page.fill_first_name("Duplicate")
        signup_page.fill_last_name("User")
        signup_page.fill_username("Heath93")
        signup_page.fill_password("s3cret")
        signup_page.fill_confirm_password("s3cret")
        signup_page.submit()

        # User should remain on the signup page (not redirected to signin)
        assert "/signup" in driver.current_url
