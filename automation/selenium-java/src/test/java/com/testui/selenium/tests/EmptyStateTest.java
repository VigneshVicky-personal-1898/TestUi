package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.EmptyStatePage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors/empty. */
public class EmptyStateTest extends BaseTest {

    @Test(description = "Open /errors/empty after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors/empty");
        Assert.assertTrue(new EmptyStatePage().waitUntilLoaded().isLoaded());
    }
}
