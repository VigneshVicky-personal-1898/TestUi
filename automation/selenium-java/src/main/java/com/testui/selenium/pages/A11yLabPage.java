package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /a11y. */
public class A11yLabPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='a11y-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='a11y-panel']")
    private WebElement panel;

    public A11yLabPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public A11yLabPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/a11y");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/a11y");
    }

    public boolean hasPanel() {
        return isDisplayed(panel);
    }
}
