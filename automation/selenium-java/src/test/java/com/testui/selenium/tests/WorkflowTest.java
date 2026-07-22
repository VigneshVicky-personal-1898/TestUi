package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.WorkflowPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /workflow. */
public class WorkflowTest extends BaseTest {

    @Test(description = "Open /workflow after login and verify page root")
    public void pageLoadsAfterLogin() {
        openAuthenticatedPath("/workflow");
        Assert.assertTrue(new WorkflowPage().waitUntilLoaded().isLoaded());
    }

    @Test(description = "Open /workflow via sidebar nav after login")
    public void pageLoadsViaSidebar() {
        loginWithSuiteCredentials();
        appShell().openNavLink("nav-link-workflow");
        Assert.assertTrue(new WorkflowPage().waitUntilLoaded().isLoaded());
    }
}
