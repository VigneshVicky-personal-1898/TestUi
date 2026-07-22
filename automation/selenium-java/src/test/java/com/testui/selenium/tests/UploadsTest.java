package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.UploadsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /uploads. */
public class UploadsTest extends BaseTest {

    @Test(description = "Open /uploads after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/uploads");
        Assert.assertTrue(new UploadsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /uploads via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-uploads");
        Assert.assertTrue(new UploadsPage().waitUntilLoaded().isLoaded());
    }
}
