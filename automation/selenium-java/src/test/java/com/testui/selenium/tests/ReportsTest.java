package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ReportsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /reports. */
public class ReportsTest extends BaseTest {

    @Test(description = "Open /reports after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/reports");
        Assert.assertTrue(new ReportsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /reports via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-reports");
        Assert.assertTrue(new ReportsPage().waitUntilLoaded().isLoaded());
    }
}
