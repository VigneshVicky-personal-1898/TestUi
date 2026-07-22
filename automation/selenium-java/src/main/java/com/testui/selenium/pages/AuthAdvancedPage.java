package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /auth-advanced. */
public class AuthAdvancedPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='auth-advanced-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='auth-adv-sso']")
    private WebElement sso;

    @FindBy(xpath = "//*[@data-testid='auth-adv-sessions']")
    private WebElement sessions;

    public AuthAdvancedPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public AuthAdvancedPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/auth-advanced");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/auth-advanced");
    }

    public boolean hasSso() {
        return isDisplayed(sso);
    }

    public boolean hasSessions() {
        return isDisplayed(sessions);
    }
}
