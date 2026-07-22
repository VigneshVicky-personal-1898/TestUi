package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /automation. */
public class AutomationLabPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='automation-page']")
    private WebElement page;

    public AutomationLabPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public AutomationLabPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/automation");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/automation");
    }

}
