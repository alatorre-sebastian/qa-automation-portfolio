"""Notification Page Object for Selenium tests.

Encapsulates selectors and actions for the notifications page of the AUT.
Uses the same data-test attribute selectors as the Playwright page objects.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

from pages.base_page import BasePage


class NotificationPage(BasePage):
    """Page object for the notifications page."""

    # Selectors matching the Playwright page objects
    SIDENAV_NOTIFICATIONS_LINK = (By.CSS_SELECTOR, '[data-test="sidenav-notifications"]')
    TOP_NAV_NOTIFICATIONS_LINK = (By.CSS_SELECTOR, '[data-test="nav-top-notifications-link"]')
    NOTIFICATIONS_COUNT = (By.CSS_SELECTOR, '[data-test="nav-top-notifications-count"]')
    NOTIFICATIONS_LIST = (By.CSS_SELECTOR, '[data-test="notifications-list"]')

    def __init__(self, driver: WebDriver):
        super().__init__(driver)

    def navigate(self) -> None:
        """Navigate to the notifications page."""
        super().navigate("/notifications")

    def get_notification_items(self) -> list[WebElement]:
        """Return a list of notification item elements."""
        return self.find_elements(*self.NOTIFICATIONS_LIST)

    def is_notifications_list_visible(self) -> bool:
        """Check if the notifications list is visible on the page."""
        return self.is_visible(*self.NOTIFICATIONS_LIST)

    def click_notifications_link(self) -> None:
        """Click the notifications link in the top nav."""
        self.click(*self.TOP_NAV_NOTIFICATIONS_LINK)
