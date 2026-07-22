package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.AuthAdvancedPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /auth-advanced. */
public class AuthAdvancedTest extends BaseTest {

    @Test(description = "Open /auth-advanced after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/auth-advanced");
        Assert.assertTrue(new AuthAdvancedPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /auth-advanced via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-auth-advanced");
        Assert.assertTrue(new AuthAdvancedPage().waitUntilLoaded().isLoaded());
    }
}
