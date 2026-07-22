package com.testui.selenium.core;

// AI-ASSISTED: Cursor
// PROMPT: Use XPath locators; fix type() for MUI inputs without clear()
// ACCEPTED-BY: vignesh

import com.testui.selenium.config.ConfigManager;
import com.testui.selenium.constants.FrameworkConstants;
import com.testui.selenium.driver.DriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * Base Page Object using Selenium Page Factory.
 * Prefer {@code @FindBy(xpath = ...)} locators (not CSS).
 */
public abstract class BasePage {

    protected final Logger log = LogManager.getLogger(getClass());
    protected final WebDriver driver;
    protected final WebDriverWait wait;
    protected final Actions actions;

    protected BasePage() {
        this.driver = DriverManager.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(
                ConfigManager.getInt("explicitWait", FrameworkConstants.DEFAULT_EXPLICIT_WAIT)));
        this.actions = new Actions(driver);
        initElements();
    }

    protected final void initElements() {
        PageFactory.initElements(driver, this);
    }

    /** XPath for any element with data-testid. */
    protected static String byTestId(String testId) {
        return "//*[@data-testid='" + testId + "']";
    }

    /** XPath for an editable input/textarea with data-testid (avoids MUI wrappers). */
    protected static String byTestIdInput(String testId) {
        return "//*[@data-testid='" + testId + "' and (self::input or self::textarea)]";
    }

    protected WebElement findByXpath(String xpath) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpath)));
    }

    protected WebElement waitVisible(WebElement element) {
        return wait.until(ExpectedConditions.visibilityOf(element));
    }

    protected WebElement waitClickable(WebElement element) {
        return wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    protected void click(WebElement element) {
        log.debug("Click {}", element);
        waitClickable(element).click();
    }

    /**
     * Types into a field. Resolves MUI wrappers to the real input and avoids
     * {@code clear()} (which throws InvalidElementState on non-input nodes).
     */
    protected void type(WebElement element, String text) {
        log.debug("Type into {} value={}", element, text);
        WebElement el = resolveEditable(waitVisible(element));
        waitClickable(el).click();
        el.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        el.sendKeys(Keys.DELETE);
        if (text != null && !text.isEmpty()) {
            el.sendKeys(text);
        }
    }

    /** If the located node is not editable, find a nested input/textarea. */
    protected WebElement resolveEditable(WebElement element) {
        String tag = element.getTagName();
        if ("input".equalsIgnoreCase(tag) || "textarea".equalsIgnoreCase(tag)) {
            return element;
        }
        try {
            List<WebElement> nested = element.findElements(By.xpath(".//input|.//textarea"));
            if (!nested.isEmpty()) {
                return nested.get(0);
            }
        } catch (Exception ignored) {
            // fall through
        }
        return element;
    }

    protected String getText(WebElement element) {
        return waitVisible(element).getText();
    }

    protected boolean isDisplayed(WebElement element) {
        try {
            return waitVisible(element).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    protected void selectByVisibleText(WebElement element, String text) {
        new Select(waitVisible(element)).selectByVisibleText(text);
    }

    protected void jsClick(WebElement element) {
        WebElement el = waitVisible(element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", el);
    }

    protected void scrollIntoView(WebElement element) {
        WebElement el = waitVisible(element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", el);
    }

    protected void hover(WebElement element) {
        actions.moveToElement(waitVisible(element)).perform();
    }

    protected void setCheckbox(WebElement element, boolean checked) {
        WebElement el = resolveEditable(waitVisible(element));
        if (el.isSelected() != checked) {
            click(el);
        }
    }

    protected boolean anyMatchText(List<WebElement> elements, String text) {
        return elements.stream().anyMatch(e -> e.getText() != null && e.getText().contains(text));
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public String getPageTitle() {
        return driver.getTitle();
    }
}
