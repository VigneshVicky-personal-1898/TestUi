package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /downloads. */
public class DownloadsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='downloads-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='downloads-actions']")
    private WebElement actions;

    @FindBy(xpath = "//*[@data-testid='downloads-history']")
    private WebElement history;

    public DownloadsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public DownloadsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/downloads");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/downloads");
    }

    public boolean hasActions() {
        return isDisplayed(actions);
    }

    public boolean hasHistory() {
        return isDisplayed(history);
    }
}
