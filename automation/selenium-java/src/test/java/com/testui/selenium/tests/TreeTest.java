package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.TreePage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /tree. */
public class TreeTest extends BaseTest {

    @Test(description = "Open /tree after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/tree");
        Assert.assertTrue(new TreePage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /tree via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-tree");
        Assert.assertTrue(new TreePage().waitUntilLoaded().isLoaded());
    }
}
