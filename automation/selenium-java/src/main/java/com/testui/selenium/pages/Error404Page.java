package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /errors/404. */
public class Error404Page extends BasePage {

    @FindBy(xpath = "//*[@data-testid='error-404-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='error-code']")
    private WebElement code;

    @FindBy(xpath = "//*[@data-testid='error-go-home']")
    private WebElement goHome;

    public Error404Page waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public Error404Page open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/errors/404");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/errors/404");
    }

    public boolean hasCode() {
        return isDisplayed(code);
    }

    public boolean hasGoHome() {
        return isDisplayed(goHome);
    }
}
