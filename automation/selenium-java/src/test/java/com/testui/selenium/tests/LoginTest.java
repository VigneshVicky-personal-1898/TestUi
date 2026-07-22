package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Remove TestNG groups; suite XML parameters drive login tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.DashboardPage;
import com.testui.selenium.pages.LoginPage;
import com.testui.selenium.utils.ExtentReportManager;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Login module scenarios — credentials from suite XML {@code email}, {@code password}, {@code captcha}.
 */
public class LoginTest extends BaseTest {

    @Test(description = "Sign in with suite-provided valid credentials")
    public void adminLoginSuccess() {
        if (ExtentReportManager.getTest() != null) {
            ExtentReportManager.getTest().info("Login as " + email);
        }
        DashboardPage dashboard = loginWithSuiteCredentials();
        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should load after login for " + email);
        Assert.assertTrue(dashboard.hasKpiCards(), "KPI cards should be visible");
    }

    @Test(description = "Demo admin chip fills credentials then uses suite captcha")
    public void fillDemoAdminChip() {
        LoginPage login = openLogin().fillDemoAdmin();
        Assert.assertTrue(login.isLoaded());
        login.enterCaptcha(captcha);
        login.clickSignIn();
        Assert.assertTrue(new DashboardPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Invalid suite credentials show error and stay on login")
    public void invalidPasswordShowsError() {
        LoginPage login = openLogin()
                .enterEmail(email)
                .enterPassword(password)
                .enterCaptcha(captcha);
        login.clickSignIn();
        Assert.assertTrue(login.isErrorVisible(), "Error alert should appear for " + email);
        Assert.assertTrue(login.getCurrentUrl().contains("/login"), "Should remain on login page");
    }

    @Test(description = "Valid suite credentials succeed (parameter-driven)")
    public void loginWithValidCredentials() {
        LoginPage login = openLogin()
                .enterEmail(email)
                .enterPassword(password)
                .enterCaptcha(captcha);
        login.clickSignIn();
        Assert.assertTrue(new DashboardPage().waitUntilLoaded().isLoaded(),
                "Expected successful login for " + email);
    }

    @Test(description = "Invalid suite credentials fail (parameter-driven)")
    public void loginWithInvalidCredentials() {
        LoginPage login = openLogin()
                .enterEmail(email)
                .enterPassword(password)
                .enterCaptcha(captcha);
        login.clickSignIn();
        Assert.assertTrue(login.isErrorVisible() || login.isLoaded(),
                "Expected login to remain on login page / show error for " + email);
        Assert.assertTrue(login.getCurrentUrl().contains("/login"),
                "Should remain on login page for " + email);
    }

    @Test(description = "Login page core UI elements are visible")
    public void loginPageUiElementsVisible() {
        LoginPage login = openLogin();
        Assert.assertTrue(login.isLoaded(), "Login page title should be visible");
        Assert.assertTrue(login.hasCoreFormFields(), "Email, password, captcha, submit should be present");
    }

    @Test(description = "Login page exposes identifiable title and form hooks")
    public void loginPageAccessibilityHooksPresent() {
        LoginPage login = openLogin();
        Assert.assertTrue(login.isLoaded(), "Accessible title text should identify TestUi login");
        Assert.assertTrue(login.hasCoreFormFields(), "Form controls must be present for assistive tech");
    }

    @Test(description = "E2E: suite credentials → dashboard with KPIs")
    public void e2eAdminLoginToDashboard() {
        DashboardPage dashboard = loginWithSuiteCredentials();
        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.hasKpiCards());
        Assert.assertTrue(dashboard.hasSalesChart());
    }
}
