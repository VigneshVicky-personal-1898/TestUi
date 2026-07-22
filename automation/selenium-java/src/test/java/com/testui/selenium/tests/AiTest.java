package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.AiPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /ai. */
public class AiTest extends BaseTest {

    @Test(description = "Open /ai after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/ai");
        Assert.assertTrue(new AiPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /ai via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-ai");
        Assert.assertTrue(new AiPage().waitUntilLoaded().isLoaded());
    }
}
