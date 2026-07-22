package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.Error403Page;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors/403. */
public class Error403Test extends BaseTest {

    @Test(description = "Open /errors/403 after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors/403");
        Assert.assertTrue(new Error403Page().waitUntilLoaded().isLoaded());
    }
}
