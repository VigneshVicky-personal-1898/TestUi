# TestUi Selenium Java Framework

<!--
AI-ASSISTED: Cursor
PROMPT: Document full TestUi page coverage across all app modules
ACCEPTED-BY: vignesh
-->

Enterprise **Selenium 4 + TestNG + Page Factory (POM)** automation for the **entire TestUi app** (auth, core modules, ecommerce, advanced labs, errors).

## Structure

```
src/main/java/com/testui/selenium/
  pages/           AppShell + ~45 page objects (all TestUi routes)
  ...
src/test/java/.../tests/
  LoginTest, DashboardTest, UsersTest
  + one *Test class per module/page (Products, Orders, Forms, …)
src/test/resources/suites/
  application/     app-wide suites (smoke covers ALL pages)
  modules/{name}/  per-module smoke|positive|negative|…|all
```

## Covered modules (47 suite folders)

**Auth:** login, forgot-password, otp, mfa  
**Core:** dashboard, users, products, orders, forms, tables, tree, workflow, reports, notifications, calendar, files, ecommerce (+ cart/wishlist/checkout), search, settings  
**Advanced:** dashboard-live, forms-advanced, advanced, enterprise-tables, charts, canvas, uploads, downloads, auth-advanced, api-sim, storage, browser-apis, admin, a11y, performance, network, errors (+ 404/403/500/empty/nodata), ai, automation, playground  

Credentials and inputs come from suite XML `<parameter>` tags (`email`, `password`, `captcha`, …). Suites select methods via `<class>` → `<methods>` → `<include>`.

## Run

```bash
cd automation/selenium-java

# Smoke across ALL pages
mvn clean test -Psmoke

# Full regression (all modules)
mvn clean test -Pregression

# Single module
mvn clean test -Pproducts
mvn clean test -Pecommerce
mvn clean test -DsuiteXmlFile=src/test/resources/suites/modules/settings/smoke.xml
mvn clean test -DsuiteXmlFile=src/test/resources/suites/modules/playground/smoke.xml
```

## Prerequisites

1. Start TestUi: `cd TestUi && npm run dev` → http://localhost:5173  
2. JDK 17+ and Maven 3.8+

## Reports & logs

- Extent HTML: `reports/ExtentReport_*.html`
- Screenshots on failure: `src/test/resources/screenshots/`
- Logs: `src/test/resources/logs/testui-selenium.log`

## Demo accounts

| Email | Password | Captcha |
|-------|----------|---------|
| admin@gmail.com | admin@123 | TEST |
| viewer@testui.com | Viewer@123 | TEST |
