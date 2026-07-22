package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /forms. */
public class FormsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='forms-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='forms-playground']")
    private WebElement playground;

    @FindBy(xpath = "//*[@data-testid='forms-btn-submit']")
    private WebElement submit;

    public FormsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public FormsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/forms");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/forms");
    }

    public boolean hasPlayground() {
        return isDisplayed(playground);
    }

    public boolean hasSubmit() {
        return isDisplayed(submit);
    }
}
