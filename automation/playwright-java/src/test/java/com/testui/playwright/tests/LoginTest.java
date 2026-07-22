package com.testui.playwright.tests;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.playwright.basetest.BaseTest;
import com.testui.playwright.dataproviders.TestDataProviders;
import com.testui.playwright.pages.DashboardPage;
import com.testui.playwright.pages.LoginPage;
import com.testui.playwright.utils.ExtentReportManager;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test(groups = {"smoke", "login"}, description = "Admin can sign in with valid credentials")
    public void adminLoginSuccess() {
        if (ExtentReportManager.getTest() != null) {
            ExtentReportManager.getTest().info("Open login and sign in as admin");
        }
        DashboardPage dashboard = openLogin()
                .loginAs("admin@gmail.com", "admin@123", "TEST");
        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should load after admin login");
        Assert.assertTrue(dashboard.hasKpiCards(), "KPI cards should be visible");
    }

    @Test(groups = {"regression", "login"}, description = "Login data-driven cases",
            dataProvider = "loginCredentials", dataProviderClass = TestDataProviders.class)
    public void loginWithDataProvider(String email, String password, String captcha, String expected) {
        LoginPage login = openLogin()
                .enterEmail(email)
                .enterPassword(password)
                .enterCaptcha(captcha);
        login.clickSignIn();

        if ("success".equalsIgnoreCase(expected)) {
            Assert.assertTrue(new DashboardPage().waitUntilLoaded().isLoaded(),
                    "Expected successful login for " + email);
        } else {
            Assert.assertTrue(login.isErrorVisible() || login.isLoaded(),
                    "Expected login failure for " + email);
        }
    }

    @Test(groups = {"smoke", "login"}, description = "Demo admin chip fills credentials")
    public void fillDemoAdminChip() {
        LoginPage login = openLogin().fillDemoAdmin();
        Assert.assertTrue(login.isLoaded());
        login.enterCaptcha("TEST");
        login.clickSignIn();
        Assert.assertTrue(new DashboardPage().waitUntilLoaded().isLoaded());
    }
}
