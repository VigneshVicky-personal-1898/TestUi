package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /workflow. */
public class WorkflowPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='workflow-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='workflow-list']")
    private WebElement list;

    @FindBy(xpath = "//*[@data-testid='workflow-create']")
    private WebElement create;

    public WorkflowPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public WorkflowPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/workflow");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/workflow");
    }

    public boolean hasList() {
        return isDisplayed(list);
    }

    public boolean hasCreate() {
        return isDisplayed(create);
    }
}
