package com.testui.selenium.constants;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

/**
 * Central paths and timing defaults for the Selenium framework.
 */
public final class FrameworkConstants {

    public static final String PROJECT_ROOT = System.getProperty("user.dir");
    public static final String CONFIG_FILE = "config.properties";
    public static final String TESTDATA_DIR = PROJECT_ROOT + "/src/test/resources/testdata/";
    public static final String SCREENSHOT_DIR = PROJECT_ROOT + "/src/test/resources/screenshots/";
    public static final String REPORT_DIR = PROJECT_ROOT + "/reports/";
    public static final String EXTENT_REPORT_PATH = REPORT_DIR + "ExtentReport.html";
    public static final String LOG_DIR = PROJECT_ROOT + "/src/test/resources/logs/";

    public static final int DEFAULT_EXPLICIT_WAIT = 15;
    public static final int DEFAULT_PAGE_LOAD_TIMEOUT = 60;
    public static final int DEFAULT_IMPLICIT_WAIT = 0;

    private FrameworkConstants() {
    }
}
