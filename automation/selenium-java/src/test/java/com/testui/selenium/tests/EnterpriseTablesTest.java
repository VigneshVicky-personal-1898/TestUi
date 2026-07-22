package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EnterpriseTablesPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /enterprise-tables. */
public class EnterpriseTablesTest extends BaseTest {

    @Test(description = "Open /enterprise-tables after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/enterprise-tables");
        Assert.assertTrue(new EnterpriseTablesPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /enterprise-tables via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-enterprise-tables");
        Assert.assertTrue(new EnterpriseTablesPage().waitUntilLoaded().isLoaded());
    }
}
