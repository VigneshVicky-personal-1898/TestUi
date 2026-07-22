package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.Set;

/** Authenticated app shell — sidebar navigation for Modules and Advanced Modules. */
public class AppShellPage extends BasePage {

    private static final Set<String> CORE_NAV = Set.of(
            "nav-link-dashboard", "nav-link-users", "nav-link-products", "nav-link-orders",
            "nav-link-forms", "nav-link-tables", "nav-link-tree", "nav-link-workflow",
            "nav-link-reports", "nav-link-notifications", "nav-link-calendar", "nav-link-files",
            "nav-link-ecommerce", "nav-link-search", "nav-link-settings"
    );

    @FindBy(xpath = "//*[@data-testid='app-layout']")
    private WebElement layout;

    @FindBy(xpath = "//*[@data-testid='nav-modules-toggle']")
    private WebElement modulesToggle;

    @FindBy(xpath = "//*[@data-testid='nav-advanced-toggle']")
    private WebElement advancedToggle;

    public AppShellPage waitUntilLoaded() {
        waitVisible(layout);
        return this;
    }

    public boolean isLoaded() {
        return isDisplayed(layout);
    }

    public AppShellPage expandModulesNav() {
        ensureNavExpanded(modulesToggle);
        return this;
    }

    public AppShellPage expandAdvancedNav() {
        ensureNavExpanded(advancedToggle);
        return this;
    }

    private void ensureNavExpanded(WebElement toggle) {
        try {
            waitVisible(toggle);
            String expanded = toggle.getAttribute("aria-expanded");
            if (expanded != null && "false".equalsIgnoreCase(expanded)) {
                click(toggle);
            }
        } catch (Exception ignored) {
            // already expanded / not present
        }
    }

    public void openNavLink(String navTestId) {
        if (CORE_NAV.contains(navTestId)) {
            expandModulesNav();
        } else {
            expandAdvancedNav();
        }
        WebElement link = driver.findElement(By.xpath("//*[@data-testid='" + navTestId + "']"));
        scrollIntoView(link);
        click(link);
    }

    public void openPath(String baseUrl, String path) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + path);
    }
}
