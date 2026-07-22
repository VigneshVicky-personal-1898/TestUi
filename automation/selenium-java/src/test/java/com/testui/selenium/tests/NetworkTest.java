package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.NetworkPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /network. */
public class NetworkTest extends BaseTest {

    @Test(description = "Open /network after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/network");
        Assert.assertTrue(new NetworkPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /network via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-network");
        Assert.assertTrue(new NetworkPage().waitUntilLoaded().isLoaded());
    }
}
