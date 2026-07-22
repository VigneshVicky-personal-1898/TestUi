package com.testui.selenium.utils;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Thin Log4j2 wrapper used across the framework.
 */
public final class LogUtils {

    private LogUtils() {
    }

    public static Logger getLogger(Class<?> clazz) {
        return LogManager.getLogger(clazz);
    }

    public static void info(Class<?> clazz, String message) {
        getLogger(clazz).info(message);
    }

    public static void error(Class<?> clazz, String message, Throwable t) {
        getLogger(clazz).error(message, t);
    }
}
