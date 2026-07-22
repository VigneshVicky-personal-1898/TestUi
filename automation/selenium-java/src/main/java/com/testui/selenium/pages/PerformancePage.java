package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /performance. */
public class PerformancePage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='performance-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='perf-list-container']")
    private WebElement list;

    public PerformancePage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public PerformancePage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/performance");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/performance");
    }

    public boolean hasList() {
        return isDisplayed(list);
    }
}
