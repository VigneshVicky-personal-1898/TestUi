package com.testui.playwright.core;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Base Page Object for Playwright.
 * Locators are created via {@link #testId(String)} (Playwright equivalent of Page Factory fields).
 */
public abstract class BasePage {

    protected final Logger log = LogManager.getLogger(getClass());
    protected final Page page;

    protected BasePage() {
        this.page = PlaywrightManager.getPage();
    }

    /** Prefer TestUi data-testid attributes. */
    protected Locator testId(String id) {
        return page.getByTestId(id);
    }

    protected void click(Locator locator) {
        log.debug("Click {}", locator);
        locator.click();
    }

    protected void fill(Locator locator, String text) {
        log.debug("Fill {} value={}", locator, text);
        locator.fill(text);
    }

    protected String text(Locator locator) {
        return locator.innerText();
    }

    protected boolean isVisible(Locator locator) {
        return locator.isVisible();
    }

    public String getUrl() {
        return page.url();
    }

    public String getTitle() {
        return page.title();
    }
}
