package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.AutomationLabPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /automation. */
public class AutomationLabTest extends BaseTest {

    @Test(description = "Open /automation after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/automation");
        Assert.assertTrue(new AutomationLabPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /automation via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-automation");
        Assert.assertTrue(new AutomationLabPage().waitUntilLoaded().isLoaded());
    }
}
