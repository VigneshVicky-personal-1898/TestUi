package com.testui.playwright.listeners;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.aventstack.extentreports.MediaEntityBuilder;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.ExtentColor;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import com.testui.playwright.utils.ExtentReportManager;
import com.testui.playwright.utils.ScreenshotUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener, ISuiteListener {

    private static final Logger LOG = LogManager.getLogger(TestListener.class);

    @Override
    public void onStart(ISuite suite) {
        ExtentReportManager.getInstance();
        LOG.info("Suite started: {}", suite.getName());
    }

    @Override
    public void onFinish(ISuite suite) {
        ExtentReportManager.flush();
        LOG.info("Suite finished: {}", suite.getName());
    }

    @Override
    public void onTestStart(ITestResult result) {
        var test = ExtentReportManager.getInstance()
                .createTest(result.getMethod().getMethodName())
                .assignCategory(result.getTestClass().getName());
        ExtentReportManager.setTest(test);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        ExtentReportManager.getTest().log(Status.PASS,
                MarkupHelper.createLabel(result.getMethod().getMethodName() + " PASSED", ExtentColor.GREEN));
    }

    @Override
    public void onTestFailure(ITestResult result) {
        LOG.error("Failed: {}", result.getMethod().getMethodName(), result.getThrowable());
        try {
            String path = ScreenshotUtils.capture(result.getMethod().getMethodName());
            String base64 = ScreenshotUtils.captureBase64();
            ExtentReportManager.getTest().fail(result.getThrowable());
            if (base64 != null) {
                ExtentReportManager.getTest().fail("Screenshot",
                        MediaEntityBuilder.createScreenCaptureFromBase64String(base64).build());
            }
            if (path != null) {
                ExtentReportManager.getTest().info("Screenshot path: " + path);
            }
        } catch (Exception e) {
            ExtentReportManager.getTest().fail(result.getThrowable());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        ExtentReportManager.getTest().log(Status.SKIP,
                MarkupHelper.createLabel(result.getMethod().getMethodName() + " SKIPPED", ExtentColor.ORANGE));
    }
}
