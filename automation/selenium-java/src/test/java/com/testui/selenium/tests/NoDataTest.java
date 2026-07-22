package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.NoDataPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /errors/nodata. */
public class NoDataTest extends BaseTest {

    @Test(description = "Open /errors/nodata after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/errors/nodata");
        Assert.assertTrue(new NoDataPage().waitUntilLoaded().isLoaded());
    }
}
