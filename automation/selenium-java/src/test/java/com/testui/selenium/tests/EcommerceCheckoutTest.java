package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EcommerceCheckoutPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /ecommerce/checkout. */
public class EcommerceCheckoutTest extends BaseTest {

    @Test(description = "Open /ecommerce/checkout after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/ecommerce/checkout");
        Assert.assertTrue(new EcommerceCheckoutPage().waitUntilLoaded().isLoaded());
    }
}
