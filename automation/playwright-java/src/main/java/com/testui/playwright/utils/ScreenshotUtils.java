package com.testui.playwright.utils;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Page;
import com.testui.playwright.constants.FrameworkConstants;
import com.testui.playwright.core.PlaywrightManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

public final class ScreenshotUtils {

    private static final Logger LOG = LogManager.getLogger(ScreenshotUtils.class);
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_SSS");

    private ScreenshotUtils() {
    }

    public static String capture(String testName) {
        try {
            Path dir = Path.of(FrameworkConstants.SCREENSHOT_DIR);
            Files.createDirectories(dir);
            String fileName = sanitize(testName) + "_" + LocalDateTime.now().format(TS) + ".png";
            Path dest = dir.resolve(fileName);
            PlaywrightManager.getPage().screenshot(new Page.ScreenshotOptions().setPath(dest).setFullPage(true));
            LOG.info("Screenshot saved: {}", dest.toAbsolutePath());
            return dest.toAbsolutePath().toString();
        } catch (Exception e) {
            LOG.error("Failed to capture screenshot", e);
            return null;
        }
    }

    public static String captureBase64() {
        byte[] bytes = PlaywrightManager.getPage().screenshot(new Page.ScreenshotOptions().setFullPage(true));
        return Base64.getEncoder().encodeToString(bytes);
    }

    private static String sanitize(String name) {
        return name == null ? "screenshot" : name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
