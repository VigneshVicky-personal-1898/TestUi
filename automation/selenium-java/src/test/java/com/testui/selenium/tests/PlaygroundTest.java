package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.PlaygroundPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /playground. */
public class PlaygroundTest extends BaseTest {

    @Test(description = "Open /playground after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/playground");
        Assert.assertTrue(new PlaygroundPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /playground via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-playground");
        Assert.assertTrue(new PlaygroundPage().waitUntilLoaded().isLoaded());
    }
}
