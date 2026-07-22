package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /errors/500. */
public class Error500Page extends BasePage {

    @FindBy(xpath = "//*[@data-testid='error-500-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='error-code']")
    private WebElement code;

    @FindBy(xpath = "//*[@data-testid='error-go-home']")
    private WebElement goHome;

    public Error500Page waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public Error500Page open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/errors/500");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/errors/500");
    }

    public boolean hasCode() {
        return isDisplayed(code);
    }

    public boolean hasGoHome() {
        return isDisplayed(goHome);
    }
}
