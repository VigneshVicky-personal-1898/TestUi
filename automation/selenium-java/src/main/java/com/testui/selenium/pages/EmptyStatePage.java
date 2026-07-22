package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /errors/empty. */
public class EmptyStatePage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='empty-state-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='empty-cta']")
    private WebElement cta;

    public EmptyStatePage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public EmptyStatePage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/errors/empty");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/errors/empty");
    }

    public boolean hasCta() {
        return isDisplayed(cta);
    }
}
