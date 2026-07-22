package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /dashboard-live. */
public class DashboardLivePage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='dashboard-live-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='dash-live-grid']")
    private WebElement grid;

    @FindBy(xpath = "//*[@data-testid='dash-live-status']")
    private WebElement status;

    public DashboardLivePage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public DashboardLivePage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/dashboard-live");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/dashboard-live");
    }

    public boolean hasGrid() {
        return isDisplayed(grid);
    }

    public boolean hasStatus() {
        return isDisplayed(status);
    }
}
