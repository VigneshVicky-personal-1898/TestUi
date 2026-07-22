package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;

import java.util.List;

/**
 * Users page object (Page Factory) for TestUi (/users).
 */
public class UsersPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='users-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='users-btn-add']")
    private WebElement addButton;

    @FindBy(xpath = "//*[@data-testid='users-search' and (self::input or self::textarea)]")
    private WebElement search;

    @FindBy(xpath = "//*[@data-testid='users-table']")
    private WebElement table;

    @FindBy(xpath = "//*[@data-testid='user-dialog']")
    private WebElement dialog;

    @FindBy(xpath = "//*[@data-testid='user-form-name' and (self::input or self::textarea)]")
    private WebElement formName;

    @FindBy(xpath = "//*[@data-testid='user-form-email' and (self::input or self::textarea)]")
    private WebElement formEmail;

    @FindBy(xpath = "//*[@data-testid='user-form-department' and (self::input or self::textarea)]")
    private WebElement formDepartment;

    @FindBy(xpath = "//*[@data-testid='user-form-phone' and (self::input or self::textarea)]")
    private WebElement formPhone;

    @FindBy(xpath = "//*[@data-testid='user-form-save']")
    private WebElement formSave;

    @FindBy(xpath = "//*[@data-testid='user-form-cancel']")
    private WebElement formCancel;

    @FindBy(xpath = "//*[@data-testid='users-btn-export']")
    private WebElement exportBtn;

    @FindBy(xpath = "//*[@data-testid='nav-link-dashboard']")
    private WebElement navDashboard;

    @FindAll(@FindBy(xpath = "//*[starts-with(@data-testid,'user-row-')]"))
    private List<WebElement> userRows;

    @FindAll(@FindBy(xpath = "//*[starts-with(@data-testid,'user-name-')]"))
    private List<WebElement> userNameCells;

    public UsersPage waitUntilLoaded() {
        waitVisible(page);
        waitVisible(table);
        return this;
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/users");
    }

    public UsersPage search(String query) {
        type(search, query);
        return this;
    }

    public UsersPage openAddUserDialog() {
        click(addButton);
        waitVisible(dialog);
        return this;
    }

    public UsersPage fillUserForm(String name, String email, String department, String phone) {
        type(formName, name);
        type(formEmail, email);
        type(formDepartment, department);
        type(formPhone, phone);
        return this;
    }

    public UsersPage saveUser() {
        click(formSave);
        return this;
    }

    public UsersPage cancelDialog() {
        click(formCancel);
        return this;
    }

    public UsersPage createUser(String name, String email, String department, String phone) {
        openAddUserDialog();
        fillUserForm(name, email, department, phone);
        saveUser();
        return this;
    }

    public boolean isUserVisible(String name) {
        search(name);
        return anyMatchText(userNameCells, name);
    }

    public UsersPage exportUsers() {
        click(exportBtn);
        return this;
    }

    public int getVisibleRowCount() {
        return userRows.size();
    }

    public boolean hasCoreUiElements() {
        return isDisplayed(addButton) && isDisplayed(search) && isDisplayed(table);
    }

    public DashboardPage navigateToDashboard() {
        click(navDashboard);
        return new DashboardPage().waitUntilLoaded();
    }
}
