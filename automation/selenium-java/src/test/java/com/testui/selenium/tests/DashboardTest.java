package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Remove TestNG groups; suite XML parameters drive dashboard tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.DashboardPage;
import com.testui.selenium.utils.ExtentReportManager;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Dashboard module scenarios — login uses suite XML email/password/captcha.
 */
public class DashboardTest extends BaseTest {

    @Test(description = "Dashboard charts and KPIs render after suite login")
    public void dashboardWidgetsVisible() {
        if (ExtentReportManager.getTest() != null) {
            ExtentReportManager.getTest().info("Login as " + email + " and verify dashboard widgets");
        }
        DashboardPage dashboard = loginWithSuiteCredentials();

        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.hasKpiCards());
        Assert.assertTrue(dashboard.hasSalesChart());
        Assert.assertTrue(dashboard.hasUsersPieChart());
    }

    @Test(description = "Dashboard page shell and navigation hooks are visible")
    public void dashboardPageUiElementsVisible() {
        DashboardPage dashboard = loginWithSuiteCredentials();
        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.hasKpiCards());
        Assert.assertTrue(dashboard.hasNavigationLinks(), "Sidebar nav links should be present");
    }

    @Test(description = "Dashboard exposes identifiable page and KPI regions")
    public void dashboardAccessibilityHooksPresent() {
        DashboardPage dashboard = loginWithSuiteCredentials();
        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.hasKpiCards());
    }

    @Test(description = "E2E: suite login → Users → Dashboard")
    public void e2eDashboardToUsersRoundTrip() {
        DashboardPage dashboard = loginWithSuiteCredentials();
        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.navigateToUsers()
                .navigateToDashboard()
                .isLoaded(), "Should return to dashboard from Users");
    }
}
