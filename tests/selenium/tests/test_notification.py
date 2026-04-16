"""Notification E2E tests for Selenium.

Mirrors the Playwright notification.spec.ts tests adapted for Selenium/pytest.
Validates: Requirements 5.2
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.notification_page import NotificationPage


def _login(driver: object) -> None:
    """Helper: log in with the default test user before each test."""
    login_page = LoginPage(driver)
    login_page.navigate()
    login_page.fill_username("Heath93")
    login_page.fill_password("s3cret")
    login_page.submit()

    # Wait for the URL to change away from /signin (full page reload)
    WebDriverWait(driver, 30).until_not(EC.url_contains("/signin"))

    # Wait for sidenav username to confirm dashboard is loaded
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, '[data-test="sidenav-username"]')
        )
    )


@pytest.mark.notification
class TestNotification:
    """Tests for the notifications functionality."""

    def test_display_notifications_list(self, driver, base_url):
        """The notifications page should show a list or a 'No Notifications' message."""
        _login(driver)

        notification_page = NotificationPage(driver)
        notification_page.navigate()

        # Verify either the notifications list is visible or the empty state is shown
        notifications_visible = notification_page.is_notifications_list_visible()

        if not notifications_visible:
            # Check for "No Notifications" text as the empty state
            no_notifications = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'No Notifications')]")
                )
            )
            assert no_notifications.is_displayed()
        else:
            assert notifications_visible

    def test_navigate_to_notifications_via_top_nav(self, driver, base_url):
        """Clicking the notifications link in the top nav should navigate to /notifications."""
        _login(driver)

        notification_page = NotificationPage(driver)
        notification_page.click_notifications_link()

        # Verify URL contains /notifications
        WebDriverWait(driver, 10).until(EC.url_contains("/notifications"))
        assert "/notifications" in driver.current_url
