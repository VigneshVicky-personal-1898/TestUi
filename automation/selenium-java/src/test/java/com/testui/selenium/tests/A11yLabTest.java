package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.A11yLabPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /a11y. */
public class A11yLabTest extends BaseTest {

    @Test(description = "Open /a11y after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/a11y");
        Assert.assertTrue(new A11yLabPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /a11y via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-a11y");
        Assert.assertTrue(new A11yLabPage().waitUntilLoaded().isLoaded());
    }
}
