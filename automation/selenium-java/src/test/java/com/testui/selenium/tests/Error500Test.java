package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.Error500Page;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors/500. */
public class Error500Test extends BaseTest {

    @Test(description = "Open /errors/500 after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors/500");
        Assert.assertTrue(new Error500Page().waitUntilLoaded().isLoaded());
    }
}
