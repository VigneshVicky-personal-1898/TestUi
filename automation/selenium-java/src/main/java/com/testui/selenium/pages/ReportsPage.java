package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /reports. */
public class ReportsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='reports-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='report-table']")
    private WebElement table;

    @FindBy(xpath = "//*[@data-testid='report-graphs']")
    private WebElement graphs;

    public ReportsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public ReportsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/reports");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/reports");
    }

    public boolean hasTable() {
        return isDisplayed(table);
    }

    public boolean hasGraphs() {
        return isDisplayed(graphs);
    }
}
