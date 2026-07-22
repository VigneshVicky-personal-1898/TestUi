# TestUi Java Automation Frameworks

<!--
AI-ASSISTED: Cursor
PROMPT: Create TestUi Selenium and Playwright Java automation frameworks
ACCEPTED-BY: vignesh
-->

Separate Maven projects for practicing enterprise UI automation against [TestUi](../README.md).

| Project | Stack | Path |
|---------|-------|------|
| **Selenium** | Selenium 4 · TestNG · **Page Factory** · ExtentReports · Log4j2 | [`selenium-java/`](selenium-java/) |
| **Playwright** | Playwright · TestNG · POM · ExtentReports · Log4j2 | [`playwright-java/`](playwright-java/) |

## Start TestUi first

```bash
cd TestUi
npm install
npm run dev
# http://localhost:5173
```

## Run Selenium (Page Factory)

```bash
cd automation/selenium-java
mvn clean test -Psmoke
```

Pages use `@FindBy` + `PageFactory.initElements` in `BasePage`.

## Run Playwright

```bash
cd automation/playwright-java
mvn exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
mvn clean test -Psmoke
```

## Shared conventions

- Locators use TestUi `data-testid` / `id` helpers (`login-email`, `users-btn-add`, …)
- ThreadLocal drivers for parallel suites
- CSV/JSON data providers, screenshots on failure, Extent HTML under `reports/`
