package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.AdminPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /admin. */
public class AdminTest extends BaseTest {

    @Test(description = "Open /admin after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/admin");
        Assert.assertTrue(new AdminPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /admin via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-admin");
        Assert.assertTrue(new AdminPage().waitUntilLoaded().isLoaded());
    }
}
