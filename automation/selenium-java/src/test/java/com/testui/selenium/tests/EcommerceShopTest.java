package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EcommerceShopPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /ecommerce. */
public class EcommerceShopTest extends BaseTest {

    @Test(description = "Open /ecommerce after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/ecommerce");
        Assert.assertTrue(new EcommerceShopPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /ecommerce via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-ecommerce");
        Assert.assertTrue(new EcommerceShopPage().waitUntilLoaded().isLoaded());
    }
}
