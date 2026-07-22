package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.FormsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /forms. */
public class FormsTest extends BaseTest {

    @Test(description = "Open /forms after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/forms");
        Assert.assertTrue(new FormsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /forms via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-forms");
        Assert.assertTrue(new FormsPage().waitUntilLoaded().isLoaded());
    }
}
