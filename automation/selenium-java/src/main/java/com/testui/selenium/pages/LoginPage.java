package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Login page object (Page Factory) for TestUi (/login).
 */
public class LoginPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='login-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='login-title']")
    private WebElement title;

    @FindBy(xpath = "//*[@data-testid='login-email' and (self::input or self::textarea)]")
    private WebElement email;

    @FindBy(xpath = "//*[@data-testid='login-password' and (self::input or self::textarea)]")
    private WebElement password;

    @FindBy(xpath = "//*[@data-testid='login-captcha' and (self::input or self::textarea)]")
    private WebElement captcha;

    @FindBy(xpath = "//*[@data-testid='login-btn-submit']")
    private WebElement submit;

    @FindBy(xpath = "//*[@data-testid='login-alert-error']")
    private WebElement errorAlert;

    @FindBy(xpath = "//*[@data-testid='login-remember-me']")
    private WebElement rememberMe;

    @FindBy(xpath = "//*[@data-testid='login-demo-admin']")
    private WebElement demoAdmin;

    @FindBy(xpath = "//*[@data-testid='login-link-forgot-password']")
    private WebElement forgotPasswordLink;

    public LoginPage open(String baseUrl) {
        String url = baseUrl.endsWith("/") ? baseUrl + "login" : baseUrl + "/login";
        driver.get(url);
        waitVisible(page);
        return this;
    }

    public LoginPage enterEmail(String value) {
        type(email, value);
        return this;
    }

    public LoginPage enterPassword(String value) {
        type(password, value);
        return this;
    }

    public LoginPage enterCaptcha(String value) {
        type(captcha, value);
        return this;
    }

    public LoginPage setRememberMe(boolean checked) {
        setCheckbox(rememberMe, checked);
        return this;
    }

    public void clickSignIn() {
        click(submit);
    }

    public DashboardPage loginAs(String userEmail, String userPassword, String captchaValue) {
        enterEmail(userEmail);
        enterPassword(userPassword);
        enterCaptcha(captchaValue);
        clickSignIn();
        return new DashboardPage().waitUntilLoaded();
    }

    public LoginPage fillDemoAdmin() {
        click(demoAdmin);
        return this;
    }

    public boolean isErrorVisible() {
        return isDisplayed(errorAlert);
    }

    public String getErrorText() {
        return getText(errorAlert);
    }

    public boolean isLoaded() {
        return isDisplayed(title) && getText(title).contains("TestUi");
    }

    /** True when email, password, captcha, and submit controls are displayed. */
    public boolean hasCoreFormFields() {
        return isDisplayed(email) && isDisplayed(password)
                && isDisplayed(captcha) && isDisplayed(submit);
    }

    public ForgotPasswordPage openForgotPassword() {
        click(forgotPasswordLink);
        return new ForgotPasswordPage().waitUntilLoaded();
    }
}
