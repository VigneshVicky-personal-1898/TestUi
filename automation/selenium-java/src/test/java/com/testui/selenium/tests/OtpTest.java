package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Cover all TestUi app pages with POM and smoke tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.OtpPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/** Automation coverage for TestUi /otp. */
public class OtpTest extends BaseTest {

    @Test(description = "Open /otp and verify page root is visible")
    public void pageLoads() {
        OtpPage page = new OtpPage().open(baseUrl);
        Assert.assertTrue(page.isLoaded(), "OtpPage should load at /otp");
    }

    @Test(description = "OTP form fields are visible")
    public void otpFormVisible() {
        OtpPage page = new OtpPage().open(baseUrl);
        Assert.assertTrue(page.hasDigits());
        Assert.assertTrue(page.hasSubmit());
    }
}
