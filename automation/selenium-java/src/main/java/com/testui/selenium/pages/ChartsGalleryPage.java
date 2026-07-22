package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /charts. */
public class ChartsGalleryPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='charts-gallery-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='charts-gauge']")
    private WebElement gauge;

    public ChartsGalleryPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public ChartsGalleryPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/charts");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/charts");
    }

    public boolean hasGauge() {
        return isDisplayed(gauge);
    }
}
