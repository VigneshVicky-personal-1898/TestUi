package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /enterprise-tables. */
public class EnterpriseTablesPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='enterprise-tables-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='ent-table']")
    private WebElement table;

    @FindBy(xpath = "//*[@data-testid='ent-table-pagination']")
    private WebElement pagination;

    public EnterpriseTablesPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public EnterpriseTablesPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/enterprise-tables");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/enterprise-tables");
    }

    public boolean hasTable() {
        return isDisplayed(table);
    }

    public boolean hasPagination() {
        return isDisplayed(pagination);
    }
}
