package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.NotificationsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /notifications. */
public class NotificationsTest extends BaseTest {

    @Test(description = "Open /notifications after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/notifications");
        Assert.assertTrue(new NotificationsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /notifications via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-notifications");
        Assert.assertTrue(new NotificationsPage().waitUntilLoaded().isLoaded());
    }
}
