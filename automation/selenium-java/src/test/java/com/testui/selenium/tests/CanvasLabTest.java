package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.CanvasLabPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /canvas. */
public class CanvasLabTest extends BaseTest {

    @Test(description = "Open /canvas after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/canvas");
        Assert.assertTrue(new CanvasLabPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /canvas via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-canvas");
        Assert.assertTrue(new CanvasLabPage().waitUntilLoaded().isLoaded());
    }
}
