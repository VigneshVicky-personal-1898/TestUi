package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /tables. */
public class TablesPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='tables-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='tables-tabs']")
    private WebElement tabs;

    public TablesPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public TablesPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/tables");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/tables");
    }

    public boolean hasTabs() {
        return isDisplayed(tabs);
    }
}
