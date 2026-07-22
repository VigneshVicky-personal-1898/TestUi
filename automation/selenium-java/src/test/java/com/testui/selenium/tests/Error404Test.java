package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.Error404Page;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors/404. */
public class Error404Test extends BaseTest {

    @Test(description = "Open /errors/404 after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors/404");
        Assert.assertTrue(new Error404Page().waitUntilLoaded().isLoaded());
    }
}
