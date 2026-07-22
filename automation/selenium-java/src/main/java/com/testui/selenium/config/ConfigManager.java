package com.testui.selenium.config;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.selenium.constants.FrameworkConstants;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

/**
 * Loads framework configuration from classpath properties and system overrides.
 * Priority: System property &gt; environment variable &gt; config.properties.
 */
public final class ConfigManager {

    private static final Logger LOG = LogManager.getLogger(ConfigManager.class);
    private static final Properties PROPS = new Properties();

    static {
        try (InputStream in = ConfigManager.class.getClassLoader()
                .getResourceAsStream(FrameworkConstants.CONFIG_FILE)) {
            if (in == null) {
                throw new IllegalStateException("Missing " + FrameworkConstants.CONFIG_FILE + " on classpath");
            }
            PROPS.load(in);
            LOG.info("Loaded configuration from {}", FrameworkConstants.CONFIG_FILE);
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    private ConfigManager() {
    }

    public static String get(String key) {
        String sys = System.getProperty(key);
        if (sys != null && !sys.isBlank()) {
            return sys.trim();
        }
        String env = System.getenv(key.toUpperCase().replace('.', '_'));
        if (env != null && !env.isBlank()) {
            return env.trim();
        }
        return Objects.toString(PROPS.getProperty(key), "").trim();
    }

    public static String get(String key, String defaultValue) {
        String value = get(key);
        return value.isEmpty() ? defaultValue : value;
    }

    public static int getInt(String key, int defaultValue) {
        String value = get(key);
        if (value.isEmpty()) {
            return defaultValue;
        }
        return Integer.parseInt(value);
    }

    public static boolean getBoolean(String key, boolean defaultValue) {
        String value = get(key);
        if (value.isEmpty()) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value);
    }

    public static String getBaseUrl() {
        return get("baseUrl", "http://localhost:5173");
    }

    public static String getBrowser() {
        return get("browser", "chrome").toLowerCase();
    }

    public static boolean isHeadless() {
        return getBoolean("headless", false);
    }
}
