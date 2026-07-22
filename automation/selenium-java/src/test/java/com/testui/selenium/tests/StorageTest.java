package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.StoragePage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /storage. */
public class StorageTest extends BaseTest {

    @Test(description = "Open /storage after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/storage");
        Assert.assertTrue(new StoragePage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /storage via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-storage");
        Assert.assertTrue(new StoragePage().waitUntilLoaded().isLoaded());
    }
}
