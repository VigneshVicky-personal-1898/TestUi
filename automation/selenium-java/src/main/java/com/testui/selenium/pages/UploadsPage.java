package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /uploads. */
public class UploadsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='uploads-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='uploads-dropzone']")
    private WebElement dropzone;

    public UploadsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public UploadsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/uploads");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/uploads");
    }

    public boolean hasDropzone() {
        return isDisplayed(dropzone);
    }
}
