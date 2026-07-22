package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.SearchPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /search. */
public class SearchTest extends BaseTest {

    @Test(description = "Open /search after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/search");
        Assert.assertTrue(new SearchPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /search via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-search");
        Assert.assertTrue(new SearchPage().waitUntilLoaded().isLoaded());
    }
}
