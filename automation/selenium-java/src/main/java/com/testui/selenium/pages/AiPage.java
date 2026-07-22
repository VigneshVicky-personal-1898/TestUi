package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /ai. */
public class AiPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='ai-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='ai-messages']")
    private WebElement messages;

    @FindBy(xpath = "//*[@data-testid='ai-input-bar']")
    private WebElement input;

    public AiPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public AiPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/ai");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/ai");
    }

    public boolean hasMessages() {
        return isDisplayed(messages);
    }

    public boolean hasInput() {
        return isDisplayed(input);
    }
}
