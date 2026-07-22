package com.testui.playwright.pages;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Locator;
import com.testui.playwright.core.BasePage;

public class UsersPage extends BasePage {

    private final Locator pageRoot;
    private final Locator addButton;
    private final Locator search;
    private final Locator table;
    private final Locator dialog;
    private final Locator formName;
    private final Locator formEmail;
    private final Locator formDepartment;
    private final Locator formPhone;
    private final Locator formSave;
    private final Locator userRows;
    private final Locator userNameCells;

    public UsersPage() {
        pageRoot = testId("users-page");
        addButton = testId("users-btn-add");
        search = testId("users-search");
        table = testId("users-table");
        dialog = testId("user-dialog");
        formName = testId("user-form-name");
        formEmail = testId("user-form-email");
        formDepartment = testId("user-form-department");
        formPhone = testId("user-form-phone");
        formSave = testId("user-form-save");
        userRows = page.locator("[data-testid^='user-row-']");
        userNameCells = page.locator("[data-testid^='user-name-']");
    }

    public UsersPage waitUntilLoaded() {
        pageRoot.waitFor();
        table.waitFor();
        return this;
    }

    public boolean isLoaded() {
        return isVisible(pageRoot) && getUrl().contains("/users");
    }

    public UsersPage search(String query) {
        fill(search, query);
        return this;
    }

    public UsersPage openAddUserDialog() {
        click(addButton);
        dialog.waitFor();
        return this;
    }

    public UsersPage fillUserForm(String name, String email, String department, String phone) {
        fill(formName, name);
        fill(formEmail, email);
        fill(formDepartment, department);
        fill(formPhone, phone);
        return this;
    }

    public UsersPage saveUser() {
        click(formSave);
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
        return userNameCells.filter(new Locator.FilterOptions().setHasText(name)).count() > 0;
    }

    public int getVisibleRowCount() {
        return (int) userRows.count();
    }
}
