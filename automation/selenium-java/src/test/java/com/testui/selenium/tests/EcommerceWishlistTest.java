package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EcommerceWishlistPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /ecommerce/wishlist. */
public class EcommerceWishlistTest extends BaseTest {

    @Test(description = "Open /ecommerce/wishlist after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/ecommerce/wishlist");
        Assert.assertTrue(new EcommerceWishlistPage().waitUntilLoaded().isLoaded());
    }
}
