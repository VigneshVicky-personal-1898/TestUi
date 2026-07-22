package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.TablesPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /tables. */
public class TablesTest extends BaseTest {

    @Test(description = "Open /tables after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/tables");
        Assert.assertTrue(new TablesPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /tables via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-tables");
        Assert.assertTrue(new TablesPage().waitUntilLoaded().isLoaded());
    }
}
