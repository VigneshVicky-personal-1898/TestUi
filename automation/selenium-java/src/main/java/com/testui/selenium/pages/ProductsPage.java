package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /products. */
public class ProductsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='products-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='products-add']")
    private WebElement addBtn;

    @FindBy(xpath = "//*[@data-testid='products-search' and (self::input or self::textarea)]")
    private WebElement search;

    @FindBy(xpath = "//*[@data-testid='products-grid']")
    private WebElement grid;

    public ProductsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public ProductsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/products");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/products");
    }

    public boolean hasAddBtn() {
        return isDisplayed(addBtn);
    }

    public boolean hasSearch() {
        return isDisplayed(search);
    }

    public boolean hasGrid() {
        return isDisplayed(grid);
    }
}
