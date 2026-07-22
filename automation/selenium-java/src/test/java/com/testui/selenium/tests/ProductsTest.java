package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.ProductsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /products. */
public class ProductsTest extends BaseTest {

    @Test(description = "Open /products after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/products");
        Assert.assertTrue(new ProductsPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /products via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-products");
        Assert.assertTrue(new ProductsPage().waitUntilLoaded().isLoaded());
    }
}
