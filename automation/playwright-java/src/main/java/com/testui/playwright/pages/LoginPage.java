package com.testui.playwright.pages;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Locator;
import com.testui.playwright.core.BasePage;

/**
 * Login page object — locators initialized like a Page Factory in the constructor.
 */
public class LoginPage extends BasePage {

    private final Locator pageRoot;
    private final Locator title;
    private final Locator email;
    private final Locator password;
    private final Locator captcha;
    private final Locator submit;
    private final Locator errorAlert;
    private final Locator demoAdmin;

    public LoginPage() {
        pageRoot = testId("login-page");
        title = testId("login-title");
        email = testId("login-email");
        password = testId("login-password");
        captcha = testId("login-captcha");
        submit = testId("login-btn-submit");
        errorAlert = testId("login-alert-error");
        demoAdmin = testId("login-demo-admin");
    }

    public LoginPage open(String baseUrl) {
        String url = baseUrl.endsWith("/") ? baseUrl + "login" : baseUrl + "/login";
        page.navigate(url);
        pageRoot.waitFor();
        return this;
    }

    public LoginPage enterEmail(String value) {
        fill(email, value);
        return this;
    }

    public LoginPage enterPassword(String value) {
        fill(password, value);
        return this;
    }

    public LoginPage enterCaptcha(String value) {
        fill(captcha, value);
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
        return isVisible(errorAlert);
    }

    public boolean isLoaded() {
        return isVisible(title) && text(title).contains("TestUi");
    }
}
