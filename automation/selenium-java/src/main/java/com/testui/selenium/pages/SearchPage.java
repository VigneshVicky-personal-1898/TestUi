package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /search. */
public class SearchPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='search-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='search-results']")
    private WebElement results;

    @FindBy(xpath = "//*[@data-testid='search-recent']")
    private WebElement recent;

    public SearchPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public SearchPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/search");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/search");
    }

    public boolean hasResults() {
        return isDisplayed(results);
    }

    public boolean hasRecent() {
        return isDisplayed(recent);
    }
}
