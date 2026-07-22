package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /ecommerce/wishlist. */
public class EcommerceWishlistPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='wishlist-page']")
    private WebElement page;

    public EcommerceWishlistPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public EcommerceWishlistPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/ecommerce/wishlist");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/ecommerce/wishlist");
    }

}
