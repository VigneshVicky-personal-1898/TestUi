package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /tree. */
public class TreePage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='tree-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='tree-view']")
    private WebElement treeView;

    public TreePage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public TreePage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/tree");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/tree");
    }

    public boolean hasTreeView() {
        return isDisplayed(treeView);
    }
}
