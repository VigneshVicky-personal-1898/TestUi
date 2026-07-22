package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /browser-apis. */
public class BrowserApisPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='browser-apis-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='browser-apis-log']")
    private WebElement log;

    public BrowserApisPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public BrowserApisPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/browser-apis");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/browser-apis");
    }

    public boolean hasLog() {
        return isDisplayed(log);
    }
}
