package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /advanced. */
public class AdvancedUiPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='advanced-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='advanced-tabs']")
    private WebElement tabs;

    @FindBy(xpath = "//*[@data-testid='advanced-stepper']")
    private WebElement stepper;

    public AdvancedUiPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public AdvancedUiPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/advanced");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/advanced");
    }

    public boolean hasTabs() {
        return isDisplayed(tabs);
    }

    public boolean hasStepper() {
        return isDisplayed(stepper);
    }
}
