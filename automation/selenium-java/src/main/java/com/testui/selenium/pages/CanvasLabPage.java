package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /canvas. */
public class CanvasLabPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='canvas-lab-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='canvas-lab-paper']")
    private WebElement paper;

    public CanvasLabPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public CanvasLabPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/canvas");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/canvas");
    }

    public boolean hasPaper() {
        return isDisplayed(paper);
    }
}
