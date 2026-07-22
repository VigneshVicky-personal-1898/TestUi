package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.OrdersPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /orders. */
public class OrdersTest extends BaseTest {

    @Test(description = "Open /orders after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/orders");
        Assert.assertTrue(new OrdersPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /orders via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-orders");
        Assert.assertTrue(new OrdersPage().waitUntilLoaded().isLoaded());
    }
}
