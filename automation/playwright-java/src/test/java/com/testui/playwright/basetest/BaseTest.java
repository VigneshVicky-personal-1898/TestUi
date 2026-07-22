package com.testui.playwright.basetest;

// AI-ASSISTED: Cursor
// PROMPT: Prefer CLI/UI headless browser baseUrl over suite XML params
// ACCEPTED-BY: vignesh

import com.testui.playwright.config.ConfigManager;
import com.testui.playwright.core.PlaywrightManager;
import com.testui.playwright.pages.LoginPage;
import com.testui.playwright.utils.ExtentReportManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

public abstract class BaseTest {

    protected final Logger log = LogManager.getLogger(getClass());
    protected String baseUrl;

    /**
     * Suite XML fills gaps only — Maven / TestUI runner (-Dheadless, -Dbrowser, -DbaseUrl) win.
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

    @Parameters({"browser", "baseUrl", "headless"})
    @BeforeMethod(alwaysRun = true)
    public void setUp(@Optional String browser,
                      @Optional String suiteBaseUrl,
                      @Optional String headless) {
        applySuiteParamIfUnset("browser", browser);
        applySuiteParamIfUnset("headless", headless);
        applySuiteParamIfUnset("baseUrl", suiteBaseUrl);

        baseUrl = ConfigManager.getBaseUrl();
        PlaywrightManager.start();
        log.info("Playwright started thread={} baseUrl={} browser={} headless={}",
                Thread.currentThread().getId(),
                baseUrl,
                ConfigManager.getBrowser(),
                ConfigManager.isHeadless());
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        PlaywrightManager.stop();
        ExtentReportManager.unload();
    }

    protected LoginPage openLogin() {
        return new LoginPage().open(baseUrl);
    }

    protected com.testui.playwright.pages.DashboardPage loginAsAdmin() {
        return openLogin().loginAs(
                ConfigManager.get("admin.email", "admin@gmail.com"),
                ConfigManager.get("admin.password", "admin@123"),
                ConfigManager.get("captcha", "TEST"));
    }
}
