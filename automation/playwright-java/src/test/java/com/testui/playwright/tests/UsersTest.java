package com.testui.playwright.tests;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.playwright.basetest.BaseTest;
import com.testui.playwright.dataproviders.TestDataProviders;
import com.testui.playwright.pages.UsersPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class UsersTest extends BaseTest {

    @Test(groups = {"smoke", "users"}, description = "Navigate to Users from sidebar")
    public void navigateToUsers() {
        UsersPage users = openLogin()
                .loginAs("admin@gmail.com", "admin@123", "TEST")
                .navigateToUsers();
        Assert.assertTrue(users.isLoaded());
        Assert.assertTrue(users.getVisibleRowCount() > 0);
    }

    @Test(groups = {"regression", "users"}, description = "Create a user via dialog",
            dataProvider = "newUsers", dataProviderClass = TestDataProviders.class)
    public void createUser(String name, String email, String department, String phone) {
        UsersPage users = openLogin()
                .loginAs("admin@gmail.com", "admin@123", "TEST")
                .navigateToUsers()
                .createUser(name, email, department, phone);
        Assert.assertTrue(users.isUserVisible(name), "Created user should appear: " + name);
    }
}
