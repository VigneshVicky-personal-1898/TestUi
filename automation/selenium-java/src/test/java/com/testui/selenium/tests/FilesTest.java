package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.FilesPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /files. */
public class FilesTest extends BaseTest {

    @Test(description = "Open /files after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/files");
        Assert.assertTrue(new FilesPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /files via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-files");
        Assert.assertTrue(new FilesPage().waitUntilLoaded().isLoaded());
    }
}
