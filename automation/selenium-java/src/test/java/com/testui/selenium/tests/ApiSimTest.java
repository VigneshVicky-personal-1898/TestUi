package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ApiSimPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /api-sim. */
public class ApiSimTest extends BaseTest {

    @Test(description = "Open /api-sim after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/api-sim");
        Assert.assertTrue(new ApiSimPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /api-sim via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-api-sim");
        Assert.assertTrue(new ApiSimPage().waitUntilLoaded().isLoaded());
    }
}
