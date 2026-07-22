package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.CalendarPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /calendar. */
public class CalendarTest extends BaseTest {

    @Test(description = "Open /calendar after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/calendar");
        Assert.assertTrue(new CalendarPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /calendar via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-calendar");
        Assert.assertTrue(new CalendarPage().waitUntilLoaded().isLoaded());
    }
}
