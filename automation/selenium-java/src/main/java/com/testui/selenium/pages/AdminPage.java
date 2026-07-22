package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /admin. */
public class AdminPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='admin-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='admin-tabs']")
    private WebElement tabs;

    public AdminPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public AdminPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/admin");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/admin");
    }

    public boolean hasTabs() {
        return isDisplayed(tabs);
    }
}
