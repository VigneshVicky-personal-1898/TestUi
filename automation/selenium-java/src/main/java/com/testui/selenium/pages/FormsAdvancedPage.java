package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /forms-advanced. */
public class FormsAdvancedPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='forms-advanced-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='forms-adv-form']")
    private WebElement form;

    @FindBy(xpath = "//*[@data-testid='forms-adv-payload']")
    private WebElement payload;

    public FormsAdvancedPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public FormsAdvancedPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/forms-advanced");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/forms-advanced");
    }

    public boolean hasForm() {
        return isDisplayed(form);
    }

    public boolean hasPayload() {
        return isDisplayed(payload);
    }
}
