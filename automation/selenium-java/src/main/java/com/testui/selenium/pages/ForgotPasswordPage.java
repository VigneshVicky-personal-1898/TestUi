package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /forgot-password. */
public class ForgotPasswordPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='forgot-password-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='forgot-password-email' and (self::input or self::textarea)]")
    private WebElement emailField;

    @FindBy(xpath = "//*[@data-testid='forgot-password-btn-submit']")
    private WebElement submit;

    @FindBy(xpath = "//*[@data-testid='forgot-password-alert-sent']")
    private WebElement alertSent;

    @FindBy(xpath = "//*[@data-testid='forgot-password-link-login']")
    private WebElement backToLogin;

    public ForgotPasswordPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public ForgotPasswordPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/forgot-password");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/forgot-password");
    }

    public boolean hasEmailField() {
        return isDisplayed(emailField);
    }

    public boolean hasSubmit() {
        return isDisplayed(submit);
    }

    public boolean hasAlertSent() {
        return isDisplayed(alertSent);
    }

    public boolean hasBackToLogin() {
        return isDisplayed(backToLogin);
    }

    public ForgotPasswordPage enterEmail(String value) {
        type(emailField, value);
        return this;
    }

    public ForgotPasswordPage submitReset() {
        click(submit);
        return this;
    }

    public boolean isResetSent() {
        return isDisplayed(alertSent);
    }

}
