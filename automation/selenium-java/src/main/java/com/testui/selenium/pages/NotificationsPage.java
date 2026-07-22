package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /notifications. */
public class NotificationsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='notifications-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='notification-panel']")
    private WebElement panel;

    public NotificationsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public NotificationsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/notifications");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/notifications");
    }

    public boolean hasPanel() {
        return isDisplayed(panel);
    }
}
