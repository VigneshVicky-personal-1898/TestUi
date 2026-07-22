package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.SettingsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /settings. */
public class SettingsTest extends BaseTest {

    @Test(description = "Open /settings after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/settings");
        Assert.assertTrue(new SettingsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /settings via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-settings");
        Assert.assertTrue(new SettingsPage().waitUntilLoaded().isLoaded());
    }
}
