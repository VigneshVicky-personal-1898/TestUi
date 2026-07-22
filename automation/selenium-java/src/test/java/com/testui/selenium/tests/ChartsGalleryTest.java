package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ChartsGalleryPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /charts. */
public class ChartsGalleryTest extends BaseTest {

    @Test(description = "Open /charts after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/charts");
        Assert.assertTrue(new ChartsGalleryPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /charts via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-charts");
        Assert.assertTrue(new ChartsGalleryPage().waitUntilLoaded().isLoaded());
    }
}
