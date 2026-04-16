"""Sign Up E2E tests for Selenium.

Mirrors the Playwright signup.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import time

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.signup_page import SignUpPage
from pages.login_page import LoginPage


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
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="sidenav-username"]')
            )
        )

        # Onboarding dialog appears for new users
        WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="user-onboarding-dialog"]')
            )
        )

        # Step 1: Click Next
        next_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, '[data-test="user-onboarding-next"]')
            )
        )
        next_button.click()

        # Step 2: Fill bank account form
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="user-onboarding-dialog-title"]')
            )
        )

        bank_name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, '[data-test="bankaccount-bankName-input"] input')
            )
        )
        bank_name_input.clear()
        bank_name_input.send_keys("The Best Bank")

        account_number_input = driver.find_element(
            By.CSS_SELECTOR, '[data-test="bankaccount-accountNumber-input"] input'
        )
        account_number_input.clear()
        account_number_input.send_keys("123456789")

        routing_number_input = driver.find_element(
            By.CSS_SELECTOR, '[data-test="bankaccount-routingNumber-input"] input'
        )
        routing_number_input.clear()
        routing_number_input.send_keys("987654321")

        submit_bank = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, '[data-test="bankaccount-submit"]')
            )
        )
        submit_bank.click()

        # Step 3: Finished — click Done
        done_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, '[data-test="user-onboarding-next"]')
            )
        )
        done_button.click()

        # Verify transaction list is visible after onboarding
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-test="transaction-list"]')
            )
        )
        transaction_list = driver.find_element(
            By.CSS_SELECTOR, '[data-test="transaction-list"]'
        )
        assert transaction_list.is_displayed()
