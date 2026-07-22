package com.testui.selenium.utils;

// AI-ASSISTED: Cursor
// PROMPT: User-friendly Extent report setup with report path and system info
// ACCEPTED-BY: vignesh

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.testui.selenium.constants.FrameworkConstants;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Thread-safe ExtentReports manager with a readable HTML report.
 */
public final class ExtentReportManager {

    private static ExtentReports extent;
    private static String reportPath;
    private static final ThreadLocal<ExtentTest> TEST = new ThreadLocal<>();

    private ExtentReportManager() {
    }

    public static synchronized ExtentReports getInstance() {
        if (extent == null) {
            try {
                Files.createDirectories(Path.of(FrameworkConstants.REPORT_DIR));
            } catch (Exception ignored) {
                // directory may already exist
            }
            String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            reportPath = FrameworkConstants.REPORT_DIR + "ExtentReport_" + stamp + ".html";

            ExtentSparkReporter spark = new ExtentSparkReporter(reportPath);
            spark.config().setDocumentTitle("TestUi Automation Report");
            spark.config().setReportName("TestUi Selenium + TestNG");
            spark.config().setTheme(Theme.STANDARD);
            spark.config().setTimeStampFormat("dd-MMM-yyyy HH:mm:ss");

            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Application", "TestUi");
            extent.setSystemInfo("Framework", "Selenium 4 + TestNG + Page Factory");
            extent.setSystemInfo("OS", System.getProperty("os.name") + " (" + System.getProperty("os.arch") + ")");
            extent.setSystemInfo("Java", System.getProperty("java.version"));
            extent.setSystemInfo("User", System.getProperty("user.name"));
            extent.setSystemInfo("Browser", System.getProperty("browser", "chrome"));
            extent.setSystemInfo("Headless", System.getProperty("headless", "false"));
            extent.setSystemInfo("Base URL", System.getProperty("baseUrl", "(from config / suite)"));
        }
        return extent;
    }

    public static String getReportPath() {
        getInstance();
        return reportPath;
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
