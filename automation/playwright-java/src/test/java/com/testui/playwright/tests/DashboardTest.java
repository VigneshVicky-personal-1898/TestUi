package com.testui.playwright.tests;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.playwright.basetest.BaseTest;
import com.testui.playwright.pages.DashboardPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DashboardTest extends BaseTest {

    @Test(groups = {"smoke", "dashboard"}, description = "Dashboard charts and KPIs render")
    public void dashboardWidgetsVisible() {
        DashboardPage dashboard = openLogin()
                .loginAs("admin@gmail.com", "admin@123", "TEST");
        Assert.assertTrue(dashboard.isLoaded());
        Assert.assertTrue(dashboard.hasKpiCards());
        Assert.assertTrue(dashboard.hasSalesChart());
        Assert.assertTrue(dashboard.hasUsersPieChart());
    }
}
