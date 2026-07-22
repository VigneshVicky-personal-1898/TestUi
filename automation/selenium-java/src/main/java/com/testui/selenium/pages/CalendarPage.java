package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /calendar. */
public class CalendarPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='calendar-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='calendar-widget']")
    private WebElement widget;

    public CalendarPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public CalendarPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/calendar");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/calendar");
    }

    public boolean hasWidget() {
        return isDisplayed(widget);
    }
}
