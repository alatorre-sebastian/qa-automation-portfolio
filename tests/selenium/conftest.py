import os
import sys
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Ensure the helpers package is importable
sys.path.insert(0, os.path.dirname(__file__))

from helpers.api_client import ApiClient

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")


def pytest_configure(config):
    """Create screenshots and reports directories if they don't exist."""
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)


@pytest.fixture
def base_url():
    """Return the base URL for the AUT, read from environment variable."""
    return os.environ.get("BASE_URL", "http://localhost:3000")


@pytest.fixture
def driver(base_url):
    """Initialize a headless Chrome WebDriver using webdriver-manager."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    chrome_driver = webdriver.Chrome(service=service, options=chrome_options)
    chrome_driver.implicitly_wait(10)

    yield chrome_driver

    chrome_driver.quit()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Capture a screenshot on test failure and attach it to the report."""
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver")
        if driver is not None:
            test_name = item.nodeid.replace("::", "_").replace("/", "_")
            screenshot_path = os.path.join(SCREENSHOTS_DIR, f"{test_name}.png")
            driver.save_screenshot(screenshot_path)


@pytest.fixture
def api_client():
    """Provide a fresh ApiClient instance for API-level tests."""
    return ApiClient()
