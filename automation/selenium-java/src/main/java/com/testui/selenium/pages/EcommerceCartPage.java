package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /ecommerce/cart. */
public class EcommerceCartPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='cart-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='cart-total']")
    private WebElement total;

    @FindBy(xpath = "//*[@data-testid='goto-checkout']")
    private WebElement checkout;

    public EcommerceCartPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public EcommerceCartPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/ecommerce/cart");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/ecommerce/cart");
    }

    public boolean hasTotal() {
        return isDisplayed(total);
    }

    public boolean hasCheckout() {
        return isDisplayed(checkout);
    }
}
