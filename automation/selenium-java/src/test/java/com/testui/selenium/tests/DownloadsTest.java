package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.DownloadsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /downloads. */
public class DownloadsTest extends BaseTest {

    @Test(description = "Open /downloads after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/downloads");
        Assert.assertTrue(new DownloadsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /downloads via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-downloads");
        Assert.assertTrue(new DownloadsPage().waitUntilLoaded().isLoaded());
    }
}
