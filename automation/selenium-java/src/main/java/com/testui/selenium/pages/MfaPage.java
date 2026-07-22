package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /mfa. */
public class MfaPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='mfa-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='mfa-code' and (self::input or self::textarea)]")
    private WebElement code;

    @FindBy(xpath = "//*[@data-testid='mfa-btn-submit']")
    private WebElement submit;

    public MfaPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public MfaPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/mfa");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/mfa");
    }

    public boolean hasCode() {
        return isDisplayed(code);
    }

    public boolean hasSubmit() {
        return isDisplayed(submit);
    }

    public MfaPage enterCode(String value) {
        type(code, value);
        return this;
    }

    public void submitMfa() {
        click(submit);
    }

}
