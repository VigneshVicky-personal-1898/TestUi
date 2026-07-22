package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EcommerceCartPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /ecommerce/cart. */
public class EcommerceCartTest extends BaseTest {

    @Test(description = "Open /ecommerce/cart after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/ecommerce/cart");
        Assert.assertTrue(new EcommerceCartPage().waitUntilLoaded().isLoaded());
    }
}
