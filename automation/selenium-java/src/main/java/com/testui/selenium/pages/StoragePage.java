package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /storage. */
public class StoragePage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='storage-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='storage-panel']")
    private WebElement panel;

    @FindBy(xpath = "//*[@data-testid='storage-tabs']")
    private WebElement tabs;

    public StoragePage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public StoragePage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/storage");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/storage");
    }

    public boolean hasPanel() {
        return isDisplayed(panel);
    }

    public boolean hasTabs() {
        return isDisplayed(tabs);
    }
}
