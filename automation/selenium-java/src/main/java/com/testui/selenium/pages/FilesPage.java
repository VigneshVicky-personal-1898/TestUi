package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /files. */
public class FilesPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='files-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='files-table']")
    private WebElement table;

    @FindBy(xpath = "//*[@data-testid='file-upload-btn']")
    private WebElement upload;

    public FilesPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public FilesPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/files");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/files");
    }

    public boolean hasTable() {
        return isDisplayed(table);
    }

    public boolean hasUpload() {
        return isDisplayed(upload);
    }
}
