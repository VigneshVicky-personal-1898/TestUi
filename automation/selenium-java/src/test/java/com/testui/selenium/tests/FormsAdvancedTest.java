package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.FormsAdvancedPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /forms-advanced. */
public class FormsAdvancedTest extends BaseTest {

    @Test(description = "Open /forms-advanced after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/forms-advanced");
        Assert.assertTrue(new FormsAdvancedPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /forms-advanced via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-forms-advanced");
        Assert.assertTrue(new FormsAdvancedPage().waitUntilLoaded().isLoaded());
    }
}
