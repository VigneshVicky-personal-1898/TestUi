package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /settings. */
public class SettingsPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='settings-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='theme-light']")
    private WebElement themeLight;

    @FindBy(xpath = "//*[@data-testid='theme-dark']")
    private WebElement themeDark;

    @FindBy(xpath = "//*[@data-testid='profile-save']")
    private WebElement profileSave;

    public SettingsPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public SettingsPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/settings");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/settings");
    }

    public boolean hasThemeLight() {
        return isDisplayed(themeLight);
    }

    public boolean hasThemeDark() {
        return isDisplayed(themeDark);
    }

    public boolean hasProfileSave() {
        return isDisplayed(profileSave);
    }
}
