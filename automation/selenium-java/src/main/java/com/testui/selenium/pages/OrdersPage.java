package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /orders. */
public class OrdersPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='orders-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='orders-search' and (self::input or self::textarea)]")
    private WebElement search;

    @FindBy(xpath = "//*[@data-testid='orders-table']")
    private WebElement table;

    public OrdersPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public OrdersPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/orders");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/orders");
    }

    public boolean hasSearch() {
        return isDisplayed(search);
    }

    public boolean hasTable() {
        return isDisplayed(table);
    }
}
