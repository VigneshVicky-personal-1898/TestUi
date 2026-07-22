package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.AdvancedUiPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /advanced. */
public class AdvancedUiTest extends BaseTest {

    @Test(description = "Open /advanced after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/advanced");
        Assert.assertTrue(new AdvancedUiPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /advanced via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-advanced");
        Assert.assertTrue(new AdvancedUiPage().waitUntilLoaded().isLoaded());
    }
}
