package com.testui.playwright.pages;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.microsoft.playwright.Locator;
import com.testui.playwright.core.BasePage;

public class DashboardPage extends BasePage {

    private final Locator pageRoot;
    private final Locator kpiCards;
    private final Locator salesChart;
    private final Locator usersPie;
    private final Locator navUsers;

    public DashboardPage() {
        pageRoot = testId("dashboard-page");
        kpiCards = testId("kpi-cards");
        salesChart = testId("sales-line-chart");
        usersPie = testId("users-pie-chart");
        navUsers = testId("nav-link-users");
    }

    public DashboardPage waitUntilLoaded() {
        pageRoot.waitFor();
        kpiCards.waitFor();
        return this;
    }

    public boolean isLoaded() {
        return isVisible(pageRoot) && getUrl().contains("/dashboard");
    }

    public boolean hasKpiCards() {
        return isVisible(kpiCards);
    }

    public boolean hasSalesChart() {
        return isVisible(salesChart);
    }

    public boolean hasUsersPieChart() {
        return isVisible(usersPie);
    }

    public UsersPage navigateToUsers() {
        click(navUsers);
        return new UsersPage().waitUntilLoaded();
    }
}
