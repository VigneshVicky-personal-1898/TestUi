package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.MfaPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /mfa. */
public class MfaTest extends BaseTest {

    @Test(description = "Open /mfa and verify page root is visible")
    public void pageLoads() {
        MfaPage page = new MfaPage().open(baseUrl);
        Assert.assertTrue(page.isLoaded(), "MfaPage should load at /mfa");
    }

    @Test(description = "MFA form fields are visible")
    public void mfaFormVisible() {
        MfaPage page = new MfaPage().open(baseUrl);
        Assert.assertTrue(page.hasCode());
        Assert.assertTrue(page.hasSubmit());
    }
}
