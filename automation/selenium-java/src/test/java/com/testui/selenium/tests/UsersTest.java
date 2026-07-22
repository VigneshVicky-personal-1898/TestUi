package com.testui.selenium.tests;

// AI-ASSISTED: Cursor
// PROMPT: Remove TestNG groups; suite XML parameters drive users tests
// ACCEPTED-BY: vignesh

import com.testui.selenium.basetest.BaseTest;
import com.testui.selenium.pages.UsersPage;
import com.testui.selenium.utils.ExtentReportManager;
import org.testng.Assert;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

/**
 * Users module scenarios — login and optional user-form fields from suite XML.
 */
public class UsersTest extends BaseTest {

    @Test(description = "Navigate to Users after suite login")
    public void navigateToUsers() {
        UsersPage users = loginWithSuiteCredentials().navigateToUsers();
        Assert.assertTrue(users.isLoaded());
        Assert.assertTrue(users.getVisibleRowCount() > 0, "Users table should have rows");
    }

    @Test(description = "Create a user using suite XML form parameters")
    @Parameters({"userName", "userEmail", "userDepartment", "userPhone"})
    public void createUser(@Optional("Ada Lovelace") String userName,
                           @Optional("ada.lovelace@testui.com") String userEmail,
                           @Optional("Engineering") String userDepartment,
                           @Optional("555-0101") String userPhone) {
        if (ExtentReportManager.getTest() != null) {
            ExtentReportManager.getTest().info("Creating user " + userName);
        }
        UsersPage users = loginWithSuiteCredentials()
                .navigateToUsers()
                .createUser(userName, userEmail, userDepartment, userPhone);

        Assert.assertTrue(users.isUserVisible(userName),
                "Created user should appear in table: " + userName);
    }

    @Test(description = "Cancel add-user dialog without saving (suite form params)")
    @Parameters({"userName", "userEmail", "userDepartment", "userPhone"})
    public void cancelAddUserLeavesTableUnchanged(
            @Optional("Temp User") String userName,
            @Optional("temp@testui.com") String userEmail,
            @Optional("QA") String userDepartment,
            @Optional("555-0000") String userPhone) {
        UsersPage users = loginWithSuiteCredentials().navigateToUsers();
        int before = users.getVisibleRowCount();
        users.openAddUserDialog()
                .fillUserForm(userName, userEmail, userDepartment, userPhone)
                .cancelDialog();
        Assert.assertTrue(users.isLoaded());
        Assert.assertEquals(users.getVisibleRowCount(), before,
                "Cancelling dialog should not add a row");
    }

    @Test(description = "Users page table, search, and add controls are visible")
    public void usersPageUiElementsVisible() {
        UsersPage users = loginWithSuiteCredentials().navigateToUsers();
        Assert.assertTrue(users.isLoaded());
        Assert.assertTrue(users.hasCoreUiElements(), "Add, search, and table should be present");
    }

    @Test(description = "Users page exposes identifiable table and action regions")
    public void usersPageAccessibilityHooksPresent() {
        UsersPage users = loginWithSuiteCredentials().navigateToUsers();
        Assert.assertTrue(users.isLoaded());
        Assert.assertTrue(users.hasCoreUiElements());
    }

    @Test(description = "E2E: suite login → users → search")
    @Parameters({"searchQuery"})
    public void e2eLoginNavigateSearchUsers(@Optional("a") String searchQuery) {
        UsersPage users = loginWithSuiteCredentials().navigateToUsers();
        Assert.assertTrue(users.isLoaded());
        Assert.assertTrue(users.getVisibleRowCount() > 0);
        users.search(searchQuery);
        Assert.assertTrue(users.isLoaded(), "Users page should remain loaded after search");
    }
}
