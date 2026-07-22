package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /ecommerce. */
public class EcommerceShopPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='ecommerce-shop']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='goto-cart']")
    private WebElement gotoCart;

    @FindBy(xpath = "//*[@data-testid='goto-wishlist']")
    private WebElement gotoWishlist;

    public EcommerceShopPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public EcommerceShopPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/ecommerce");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        String url = getCurrentUrl();
        return isDisplayed(page)
                && url.contains("/ecommerce")
                && !url.contains("/cart")
                && !url.contains("/wishlist")
                && !url.contains("/checkout");
    }

    public boolean hasGotoCart() {
        return isDisplayed(gotoCart);
    }

    public boolean hasGotoWishlist() {
        return isDisplayed(gotoWishlist);
    }
}
