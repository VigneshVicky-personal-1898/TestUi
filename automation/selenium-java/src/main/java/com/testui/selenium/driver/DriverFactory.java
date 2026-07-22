package com.testui.selenium.driver;

// AI-ASSISTED: Cursor
// PROMPT: Suppress Selenium CDP console warnings when creating drivers
// ACCEPTED-BY: vignesh

import com.testui.selenium.config.ConfigManager;
import com.testui.selenium.constants.FrameworkConstants;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;

/**
 * Creates and configures WebDriver instances for Chrome / Firefox / Edge.
 */
public final class DriverFactory {

    private static final Logger LOG = LogManager.getLogger(DriverFactory.class);

    static {
        suppressSeleniumCdpWarnings();
    }

    private DriverFactory() {
    }

    /** CDP version warnings are harmless; they clutter the colored test console. */
    private static void suppressSeleniumCdpWarnings() {
        java.util.logging.Logger.getLogger("org.openqa.selenium").setLevel(Level.SEVERE);
        java.util.logging.Logger.getLogger("org.openqa.selenium.devtools").setLevel(Level.OFF);
        java.util.logging.Logger.getLogger("org.openqa.selenium.chromium").setLevel(Level.OFF);
        java.util.logging.Logger.getLogger("org.openqa.selenium.devtools.CdpVersionFinder").setLevel(Level.OFF);
        java.util.logging.Logger.getLogger("org.openqa.selenium.chromium.ChromiumDriver").setLevel(Level.OFF);
    }

    public static WebDriver createDriver() {
        suppressSeleniumCdpWarnings();
        String browser = ConfigManager.getBrowser();
        boolean headless = ConfigManager.isHeadless();
        LOG.info("Creating WebDriver browser={} headless={}", browser, headless);

        WebDriver driver = switch (browser) {
            case "firefox" -> createFirefox(headless);
            case "edge" -> createEdge(headless);
            default -> createChrome(headless);
        };

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(FrameworkConstants.DEFAULT_IMPLICIT_WAIT));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(
                ConfigManager.getInt("pageLoadTimeout", FrameworkConstants.DEFAULT_PAGE_LOAD_TIMEOUT)));
        driver.manage().window().maximize();
        return driver;
    }

    private static WebDriver createChrome(boolean headless) {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        if (headless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1920,1080");
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("download.default_directory", FrameworkConstants.PROJECT_ROOT + "/downloads");
        options.setExperimentalOption("prefs", prefs);
        return new ChromeDriver(options);
    }

    private static WebDriver createFirefox(boolean headless) {
        WebDriverManager.firefoxdriver().setup();
        FirefoxOptions options = new FirefoxOptions();
        if (headless) {
            options.addArguments("-headless");
        }
        return new FirefoxDriver(options);
    }

    private static WebDriver createEdge(boolean headless) {
        WebDriverManager.edgedriver().setup();
        EdgeOptions options = new EdgeOptions();
        if (headless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1920,1080");
        return new EdgeDriver(options);
    }
}
