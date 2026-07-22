# TestUi Playwright Java Framework

<!--
AI-ASSISTED: Cursor
PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
ACCEPTED-BY: vignesh
-->

Enterprise **Playwright + TestNG + Page Object Model** automation for TestUi.

> Note: Selenium’s `@FindBy` **Page Factory** lives in the sibling [`../selenium-java`](../selenium-java) project.
> This Playwright project uses the equivalent pattern: locator fields initialized in each page constructor.

## Structure

```
src/main/java/com/testui/playwright/
  config/      ConfigManager
  constants/   FrameworkConstants
  core/        BasePage, PlaywrightManager (ThreadLocal)
  pages/       LoginPage, DashboardPage, UsersPage
  utils/       Screenshot, ExtentReport, DataReader
src/test/...
  basetest/, listeners/, dataproviders/, tests/
  resources/suites/, testdata/, config.properties
```

## Prerequisites

1. `cd TestUi && npm run dev`
2. JDK 17+, Maven 3.8+
3. Install browsers once:

```bash
cd automation/playwright-java
mvn -q exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
```

## Run

```bash
mvn clean test -Psmoke
mvn clean test -Pregression
mvn clean test -Pparallel
mvn clean test -Psmoke -Dbrowser=firefox -Dheadless=true
```

## Reports

- `reports/ExtentReport_*.html`
- Failure screenshots under `src/test/resources/screenshots/`
