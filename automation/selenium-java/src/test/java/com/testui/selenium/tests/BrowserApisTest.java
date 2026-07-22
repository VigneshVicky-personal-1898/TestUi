package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.BrowserApisPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /browser-apis. */
public class BrowserApisTest extends BaseTest {

    @Test(description = "Open /browser-apis after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/browser-apis");
        Assert.assertTrue(new BrowserApisPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /browser-apis via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-browser-apis");
        Assert.assertTrue(new BrowserApisPage().waitUntilLoaded().isLoaded());
    }
}
