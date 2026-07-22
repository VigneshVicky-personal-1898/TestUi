package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Dashboard page object (Page Factory) for TestUi (/dashboard).
 */
public class DashboardPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='dashboard-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='kpi-cards']")
    private WebElement kpiCards;

    @FindBy(xpath = "//*[@data-testid='sales-line-chart']")
    private WebElement salesChart;

    @FindBy(xpath = "//*[@data-testid='users-pie-chart']")
    private WebElement usersPie;

    @FindBy(xpath = "//*[@data-testid='nav-link-users']")
    private WebElement navUsers;

    @FindBy(xpath = "//*[@data-testid='nav-link-dashboard']")
    private WebElement navDashboard;

    public DashboardPage waitUntilLoaded() {
        waitVisible(page);
        waitVisible(kpiCards);
        return this;
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/dashboard");
    }

    public boolean hasKpiCards() {
        return isDisplayed(kpiCards);
    }

    public boolean hasSalesChart() {
        return isDisplayed(salesChart);
    }

    public boolean hasUsersPieChart() {
        return isDisplayed(usersPie);
    }

    public boolean hasNavigationLinks() {
        return isDisplayed(navUsers) && isDisplayed(navDashboard);
    }

    public UsersPage navigateToUsers() {
        click(navUsers);
        return new UsersPage().waitUntilLoaded();
    }
}
