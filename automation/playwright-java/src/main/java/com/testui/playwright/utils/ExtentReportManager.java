package com.testui.playwright.utils;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.testui.playwright.constants.FrameworkConstants;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class ExtentReportManager {

    private static ExtentReports extent;
    private static final ThreadLocal<ExtentTest> TEST = new ThreadLocal<>();

    private ExtentReportManager() {
    }

    public static synchronized ExtentReports getInstance() {
        if (extent == null) {
            try {
                Files.createDirectories(Path.of(FrameworkConstants.REPORT_DIR));
            } catch (Exception ignored) {
            }
            String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            ExtentSparkReporter spark = new ExtentSparkReporter(
                    FrameworkConstants.REPORT_DIR + "ExtentReport_" + stamp + ".html");
            spark.config().setDocumentTitle("TestUi Playwright Report");
            spark.config().setReportName("TestUi Playwright Automation");
            spark.config().setTheme(Theme.STANDARD);
            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Application", "TestUi");
            extent.setSystemInfo("Framework", "Playwright + TestNG + POM");
            extent.setSystemInfo("Java", System.getProperty("java.version"));
        }
        return extent;
    }

    public static void setTest(ExtentTest test) {
        TEST.set(test);
    }

    public static ExtentTest getTest() {
        return TEST.get();
    }

    public static void unload() {
        TEST.remove();
    }

    public static synchronized void flush() {
        if (extent != null) {
            extent.flush();
        }
    }
}
