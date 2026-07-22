package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /errors. */
public class ErrorsIndexPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='errors-index']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='link-404']")
    private WebElement link404;

    @FindBy(xpath = "//*[@data-testid='link-403']")
    private WebElement link403;

    @FindBy(xpath = "//*[@data-testid='link-500']")
    private WebElement link500;

    public ErrorsIndexPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public ErrorsIndexPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/errors");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/errors");
    }

    public boolean hasLink404() {
        return isDisplayed(link404);
    }

    public boolean hasLink403() {
        return isDisplayed(link403);
    }

    public boolean hasLink500() {
        return isDisplayed(link500);
    }
}
