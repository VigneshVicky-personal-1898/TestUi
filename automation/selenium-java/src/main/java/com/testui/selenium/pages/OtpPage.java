package com.testui.selenium.pages;

// AI-ASSISTED: Cursor
// PROMPT: Switch page locators from CSS to XPath
// ACCEPTED-BY: vignesh

import com.testui.selenium.core.BasePage;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object for TestUi route /otp. */
public class OtpPage extends BasePage {

    @FindBy(xpath = "//*[@data-testid='otp-page']")
    private WebElement page;

    @FindBy(xpath = "//*[@data-testid='otp-digits']")
    private WebElement digits;

    @FindBy(xpath = "//*[@data-testid='otp-btn-submit']")
    private WebElement submit;

    public OtpPage waitUntilLoaded() {
        waitVisible(page);
        return this;
    }

    public OtpPage open(String baseUrl) {
        String root = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        driver.get(root + "/otp");
        return waitUntilLoaded();
    }

    public boolean isLoaded() {
        return isDisplayed(page) && getCurrentUrl().contains("/otp");
    }

    public boolean hasDigits() {
        return isDisplayed(digits);
    }

    public boolean hasSubmit() {
        return isDisplayed(submit);
    }

    public OtpPage enterOtp(String code) {
        for (int i = 0; i < code.length() && i < 6; i++) {
            WebElement digit = driver.findElement(
                    org.openqa.selenium.By.cssSelector("[data-testid='otp-digit-" + i + "']"));
            type(digit, String.valueOf(code.charAt(i)));
        }
        return this;
    }

    public void submitOtp() {
        click(submit);
    }

}
