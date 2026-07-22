package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ErrorsIndexPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors. */
public class ErrorsIndexTest extends BaseTest {

    @Test(description = "Open /errors after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors");
        Assert.assertTrue(new ErrorsIndexPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /errors via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-errors");
        Assert.assertTrue(new ErrorsIndexPage().waitUntilLoaded().isLoaded());
    }
}
