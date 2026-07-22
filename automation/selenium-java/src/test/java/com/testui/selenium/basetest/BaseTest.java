package com.testui.selenium.basetest;

// AI-ASSISTED: Cursor
// PROMPT: Prefer CLI/UI headless browser baseUrl over suite XML params
// ACCEPTED-BY: vignesh

import com.testui.selenium.config.ConfigManager;
import com.testui.selenium.driver.DriverFactory;
import com.testui.selenium.driver.DriverManager;
import com.testui.selenium.pages.AppShellPage;
import com.testui.selenium.pages.DashboardPage;
import com.testui.selenium.pages.LoginPage;
import com.testui.selenium.utils.ExtentReportManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

/** Base TestNG class — WebDriver per method + suite XML credentials. */
public abstract class BaseTest {

    protected final Logger log = LogManager.getLogger(getClass());
    protected String baseUrl;
    protected String email;
    protected String password;
    protected String captcha;

    /**
     * Apply suite XML value only when the property was not already set by Maven / TestUI runner (-D…).
     * Lets the UI choose Visible vs Headless without suite XML overriding it.
     */
    private static void applySuiteParamIfUnset(String key, String suiteValue) {
        if (suiteValue == null || suiteValue.isBlank()) {
            return;
        }
        String existing = System.getProperty(key);
        if (existing == null || existing.isBlank()) {
            System.setProperty(key, suiteValue.trim());
        }
    }

    @Parameters({"browser", "baseUrl", "headless", "email", "password", "captcha"})
    @BeforeMethod(alwaysRun = true)
    public void setUp(@Optional String browser,
                      @Optional String suiteBaseUrl,
                      @Optional String headless,
                      @Optional("admin@gmail.com") String email,
                      @Optional("admin@123") String password,
                      @Optional("TEST") String captcha) {
        applySuiteParamIfUnset("browser", browser);
        applySuiteParamIfUnset("headless", headless);
        applySuiteParamIfUnset("baseUrl", suiteBaseUrl);

        baseUrl = ConfigManager.getBaseUrl();
        this.email = email;
        this.password = password;
        this.captcha = captcha;
        DriverManager.setDriver(DriverFactory.createDriver());
        log.info("Driver started thread={} baseUrl={} browser={} headless={} email={}",
                Thread.currentThread().getId(),
                baseUrl,
                ConfigManager.getBrowser(),
                ConfigManager.isHeadless(),
                this.email);
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        DriverManager.quitDriver();
        ExtentReportManager.unload();
    }

    protected LoginPage openLogin() {
        return new LoginPage().open(baseUrl);
    }

    protected DashboardPage loginWithSuiteCredentials() {
        return openLogin().loginAs(email, password, captcha);
    }

    protected AppShellPage appShell() {
        return new AppShellPage().waitUntilLoaded();
    }

    protected void openAuthenticatedPath(String path) {
        loginWithSuiteCredentials();
        appShell().openPath(baseUrl, path);
    }
}
