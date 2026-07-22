package com.testui.selenium.utils;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.selenium.constants.FrameworkConstants;
import com.testui.selenium.driver.DriverManager;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Screenshot capture helpers for failure reporting.
 */
public final class ScreenshotUtils {

    private static final Logger LOG = LogManager.getLogger(ScreenshotUtils.class);
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_SSS");

    private ScreenshotUtils() {
    }

    public static String capture(String testName) {
        WebDriver driver = DriverManager.getDriver();
        File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        String fileName = sanitize(testName) + "_" + LocalDateTime.now().format(TS) + ".png";
        Path destDir = Path.of(FrameworkConstants.SCREENSHOT_DIR);
        try {
            Files.createDirectories(destDir);
            File dest = destDir.resolve(fileName).toFile();
            FileUtils.copyFile(src, dest);
            LOG.info("Screenshot saved: {}", dest.getAbsolutePath());
            return dest.getAbsolutePath();
        } catch (IOException e) {
            LOG.error("Failed to save screenshot", e);
            return null;
        }
    }

    public static String captureBase64() {
        return ((TakesScreenshot) DriverManager.getDriver()).getScreenshotAs(OutputType.BASE64);
    }

    private static String sanitize(String name) {
        return name == null ? "screenshot" : name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
