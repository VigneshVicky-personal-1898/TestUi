package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.PerformancePage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /performance. */
public class PerformanceTest extends BaseTest {

    @Test(description = "Open /performance after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/performance");
        Assert.assertTrue(new PerformancePage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /performance via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-performance");
        Assert.assertTrue(new PerformancePage().waitUntilLoaded().isLoaded());
    }
}
