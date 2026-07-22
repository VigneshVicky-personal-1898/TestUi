package com.testui.selenium.driver;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import org.openqa.selenium.WebDriver;

/**
 * Thread-local WebDriver holder for safe parallel TestNG execution.
 */
public final class DriverManager {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverManager() {
    }

    public static void setDriver(WebDriver driver) {
        DRIVER.set(driver);
    }

    public static WebDriver getDriver() {
        WebDriver driver = DRIVER.get();
        if (driver == null) {
            throw new IllegalStateException("WebDriver is not initialized for this thread");
        }
        return driver;
    }

    public static void quitDriver() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            driver.quit();
            DRIVER.remove();
        }
    }
}
