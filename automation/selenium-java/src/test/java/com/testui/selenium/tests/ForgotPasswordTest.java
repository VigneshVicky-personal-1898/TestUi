package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ForgotPasswordPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /forgot-password. */
public class ForgotPasswordTest extends BaseTest {

    @Test(description = "Open /forgot-password and verify page root is visible")
    public void pageLoads() {
        ForgotPasswordPage page = new ForgotPasswordPage().open(baseUrl);
        Assert.assertTrue(page.isLoaded(), "ForgotPasswordPage should load at /forgot-password");
    }

    @Test(description = "Submit forgot-password with suite email parameter")
    public void submitForgotPasswordWithValidEmail() {
        ForgotPasswordPage page = new ForgotPasswordPage().open(baseUrl).enterEmail(email).submitReset();
        Assert.assertTrue(page.isResetSent(), "Reset sent alert should appear");
    }

    @Test(description = "Navigate to forgot-password from login link")
    public void openForgotPasswordFromLogin() {
        Assert.assertTrue(openLogin().openForgotPassword().isLoaded());
    }
}
