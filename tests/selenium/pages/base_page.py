"""Base Page Object for Selenium tests.

Provides common methods for page interaction using explicit waits.
All page objects inherit from this class.
"""

import os

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


SCREENSHOTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "screenshots")


class BasePage:
    """Base class for all page objects."""

    def __init__(self, driver: WebDriver, timeout: int = 10):
        self.driver = driver
        self.timeout = timeout
        self.base_url = os.environ.get("BASE_URL", "http://localhost:3000")

    def navigate(self, path: str = "") -> None:
        """Navigate to the base URL plus an optional path."""
        self.driver.get(f"{self.base_url}{path}")

    def find_element(self, by: str, value: str) -> WebElement:
        """Find a single element using an explicit wait."""
        return WebDriverWait(self.driver, self.timeout).until(
            EC.presence_of_element_located((by, value))
        )

    def find_elements(self, by: str, value: str) -> list[WebElement]:
        """Find multiple elements using an explicit wait."""
        WebDriverWait(self.driver, self.timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return self.driver.find_elements(by, value)

    def click(self, by: str, value: str) -> None:
        """Find an element and click it."""
        element = WebDriverWait(self.driver, self.timeout).until(
            EC.element_to_be_clickable((by, value))
        )
        element.click()

    def type_text(self, by: str, value: str, text: str) -> None:
        """Clear an input field and type text into it."""
        element = self.find_element(by, value)
        element.clear()
        element.send_keys(text)

    def get_text(self, by: str, value: str) -> str:
        """Get the text content of an element."""
        element = self.find_element(by, value)
        return element.text

    def is_visible(self, by: str, value: str) -> bool:
        """Check if an element is visible on the page. Returns False without raising."""
        try:
            WebDriverWait(self.driver, self.timeout).until(
                EC.visibility_of_element_located((by, value))
            )
            return True
        except TimeoutException:
            return False

    def wait_for_url_contains(self, text: str, timeout: int = 10) -> None:
        """Wait until the current URL contains the given text."""
        WebDriverWait(self.driver, timeout).until(EC.url_contains(text))

    def take_screenshot(self, name: str) -> None:
        """Save a screenshot to the screenshots directory."""
        os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
        filepath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
        self.driver.save_screenshot(filepath)

    def _set_input_value_and_blur(self, element: WebElement, value: str) -> None:
        """Set an input's value using the native setter to trigger React's onChange,
        then dispatch input/change events and blur.

        Selenium's element.clear() doesn't fire React synthetic events, so we
        use the native HTMLInputElement value setter to properly trigger Formik
        validation.
        """
        self.driver.execute_script(
            "arguments[0].focus();"
            "var nativeInputValueSetter = Object.getOwnPropertyDescriptor("
            "  window.HTMLInputElement.prototype, 'value').set;"
            "nativeInputValueSetter.call(arguments[0], arguments[1]);"
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));"
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));"
            "arguments[0].blur();",
            element,
            value,
        )
