package com.testui.playwright.core;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.testui.playwright.config.ConfigManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Thread-local Playwright / Browser / Context / Page factory for parallel TestNG.
 */
public final class PlaywrightManager {

    private static final Logger LOG = LogManager.getLogger(PlaywrightManager.class);

    private static final ThreadLocal<Playwright> PLAYWRIGHT = new ThreadLocal<>();
    private static final ThreadLocal<Browser> BROWSER = new ThreadLocal<>();
    private static final ThreadLocal<BrowserContext> CONTEXT = new ThreadLocal<>();
    private static final ThreadLocal<Page> PAGE = new ThreadLocal<>();

    private PlaywrightManager() {
    }

    public static void start() {
        Playwright pw = Playwright.create();
        PLAYWRIGHT.set(pw);

        String browserName = ConfigManager.getBrowser();
        boolean headless = ConfigManager.isHeadless();
        LOG.info("Launching Playwright browser={} headless={}", browserName, headless);

        BrowserType.LaunchOptions launch = new BrowserType.LaunchOptions().setHeadless(headless);
        Browser browser = switch (browserName) {
            case "firefox" -> pw.firefox().launch(launch);
            case "webkit" -> pw.webkit().launch(launch);
            default -> pw.chromium().launch(launch);
        };
        BROWSER.set(browser);

        Browser.NewContextOptions ctxOpts = new Browser.NewContextOptions()
                .setViewportSize(1920, 1080)
                .setIgnoreHTTPSErrors(true);
        BrowserContext context = browser.newContext(ctxOpts);
        context.setDefaultTimeout(ConfigManager.getTimeoutMs());
        CONTEXT.set(context);

        Page page = context.newPage();
        PAGE.set(page);
    }

    public static Page getPage() {
        Page page = PAGE.get();
        if (page == null) {
            throw new IllegalStateException("Playwright Page is not initialized for this thread");
        }
        return page;
    }

    public static BrowserContext getContext() {
        return CONTEXT.get();
    }

    public static void stop() {
        try {
            if (CONTEXT.get() != null) {
                CONTEXT.get().close();
            }
        } finally {
            CONTEXT.remove();
        }
        try {
            if (BROWSER.get() != null) {
                BROWSER.get().close();
            }
        } finally {
            BROWSER.remove();
        }
        try {
            if (PLAYWRIGHT.get() != null) {
                PLAYWRIGHT.get().close();
            }
        } finally {
            PLAYWRIGHT.remove();
            PAGE.remove();
        }
    }
}
