package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /playground. */
public class PlaygroundPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='playground-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='playground-tabs']")
    private WebElement tabs;

    @FindBy(xpath = "//*[@data-testid='playground-intro']")
    private WebElement intro;

    public PlaygroundPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public PlaygroundPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/playground");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/playground");
    }

    public boolean hasTabs() {
        return isDisplayed(tabs);
    }

    public boolean hasIntro() {
        return isDisplayed(intro);
    }
}
