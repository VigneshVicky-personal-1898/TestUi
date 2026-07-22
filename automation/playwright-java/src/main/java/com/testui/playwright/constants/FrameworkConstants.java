package com.testui.playwright.constants;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

public final class FrameworkConstants {

    public static final String PROJECT_ROOT = System.getProperty("user.dir");
    public static final String CONFIG_FILE = "config.properties";
    public static final String TESTDATA_DIR = PROJECT_ROOT + "/src/test/resources/testdata/";
    public static final String SCREENSHOT_DIR = PROJECT_ROOT + "/src/test/resources/screenshots/";
    public static final String REPORT_DIR = PROJECT_ROOT + "/reports/";
    public static final double DEFAULT_TIMEOUT_MS = 15_000;

    private FrameworkConstants() {
    }
}
