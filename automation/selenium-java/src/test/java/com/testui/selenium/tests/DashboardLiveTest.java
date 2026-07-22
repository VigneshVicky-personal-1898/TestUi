package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.DashboardLivePage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /dashboard-live. */
public class DashboardLiveTest extends BaseTest {

    @Test(description = "Open /dashboard-live after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/dashboard-live");
        Assert.assertTrue(new DashboardLivePage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /dashboard-live via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-dashboard-live");
        Assert.assertTrue(new DashboardLivePage().waitUntilLoaded().isLoaded());
    }
}
