// AI-ASSISTED: Cursor
// PROMPT: Add Test Runner Automation Help for suite execution UI
// ACCEPTED-BY: vignesh

/**
 * Catalog of Automation Help content keyed by PageHeader `pageId`.
 * Each entry explains concepts, techniques, best practices, and framework samples.
 */

function entry({
  title,
  summary,
  description,
  concepts,
  techniques,
  bestPractices,
  selenium,
  playwright,
  cypress,
  suitableFor,
}) {
  return {
    title,
    summary,
    description,
    concepts,
    techniques,
    bestPractices,
    selenium,
    playwright,
    cypress,
    suitableFor,
  }
}

const DEFAULT = entry({
  title: 'This page',
  summary: 'Practice stable locators, waits, and Page Object Model patterns.',
  description:
    'Use data-testid / id attributes exposed on this page. Prefer explicit waits over sleeps. Model the page as a Page Object (POM) so scripts stay maintainable.',
  concepts: ['Page Object Model (POM)', 'CSS selectors', 'XPath', 'Explicit waits', 'Synchronization'],
  techniques: [
    'Locate elements by #id or [data-testid]',
    'Wait for visibility/clickability before acting',
    'Assert text, state, and URL after actions',
  ],
  bestPractices: [
    'Avoid brittle XPath tied to layout index when ids exist',
    'Keep selectors in page objects, not in tests',
    'Never use Thread.sleep / hard waits as the primary sync strategy',
  ],
  selenium: `// POM + explicit wait
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='...']")));
el.click();`,
  playwright: `// Prefer getByTestId + auto-waiting
await page.getByTestId('...').click();
await expect(page.getByTestId('...')).toBeVisible();`,
  cypress: `cy.get('[data-testid="..."]').should('be.visible').click();
cy.url().should('include', '/...');`,
  suitableFor: 'All three frameworks — prefer Playwright/Cypress for speed; Selenium for classic interview POM/Page Factory demos.',
})

export const AUTOMATION_HELP = {
  login: entry({
    title: 'Login',
    summary: 'Forms, credentials, captcha, Remember Me, and auth redirects.',
    description:
      'Classic form automation: type into email/password, handle captcha text, toggle visibility, submit, and assert success or validation errors. Ideal for POM / Page Factory demos.',
    concepts: [
      'Page Object Model (POM)',
      'Page Factory',
      'sendKeys()',
      'Explicit waits',
      'CSS selectors',
      'XPath',
      'Keyboard events',
    ],
    techniques: [
      'Fill #login-email / #login-password with sendKeys or fill()',
      'Submit via #login-btn-submit and wait for dashboard URL',
      'Assert invalid-credential / field validation messages',
      'Toggle password visibility and Remember Me checkbox',
    ],
    bestPractices: [
      'Store credentials in env/secrets — never hardcode in shared repos',
      'Use data-testid over positional XPath for form fields',
      'Wait for navigation after submit (not a fixed sleep)',
      'In Selenium, @FindBy + PageFactory.initElements for interview-ready POM',
    ],
    selenium: `public class LoginPage {
  @FindBy(css = "[data-testid='login-email']") WebElement email;
  @FindBy(css = "[data-testid='login-password']") WebElement password;
  @FindBy(css = "[data-testid='login-btn-submit']") WebElement submit;

  public LoginPage(WebDriver driver) {
    PageFactory.initElements(driver, this);
  }
  public void login(String user, String pass) {
    email.clear(); email.sendKeys(user);
    password.clear(); password.sendKeys(pass);
    submit.click();
  }
}
// Wait: new WebDriverWait(driver, Duration.ofSeconds(10))
//   .until(ExpectedConditions.urlContains("/dashboard"));`,
    playwright: `await page.getByTestId('login-email').fill('admin@gmail.com');
await page.getByTestId('login-password').fill('admin@123');
await page.getByTestId('login-captcha').fill('TEST');
await page.getByTestId('login-btn-submit').click();
await expect(page).toHaveURL(/dashboard/);`,
    cypress: `cy.get('[data-testid="login-email"]').clear().type('admin@gmail.com');
cy.get('[data-testid="login-password"]').clear().type('admin@123');
cy.get('[data-testid="login-captcha"]').type('TEST');
cy.get('[data-testid="login-btn-submit"]').click();
cy.url().should('include', '/dashboard');`,
    suitableFor: 'Selenium shines for POM/Page Factory interviews; Playwright/Cypress are faster for day-to-day auth flows.',
  }),

  'forgot-password': entry({
    title: 'Forgot Password',
    summary: 'Email recovery form, validation, and success messaging.',
    description: 'Practice form validation, disabled-submit states, and asserting success alerts after submitting a recovery request.',
    concepts: ['POM', 'sendKeys()', 'Explicit waits', 'Assertions', 'CSS selectors'],
    techniques: ['Fill recovery email', 'Submit and wait for success Alert', 'Negative tests for empty/invalid email'],
    bestPractices: ['Assert message text and role="alert"', 'Reuse Login page object patterns'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='forgot-email']")).sendKeys("admin@gmail.com");
driver.findElement(By.cssSelector("[data-testid='forgot-btn-submit']")).click();
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid*='success']")));`,
    playwright: `await page.getByTestId('forgot-email').fill('admin@gmail.com');
await page.getByTestId('forgot-btn-submit').click();
await expect(page.getByRole('alert')).toBeVisible();`,
    cypress: `cy.get('[data-testid="forgot-email"]').type('admin@gmail.com');
cy.get('[data-testid="forgot-btn-submit"]').click();
cy.get('[role="alert"]').should('be.visible');`,
    suitableFor: 'Any framework — good warm-up for form + assertion patterns.',
  }),

  otp: entry({
    title: 'OTP Verification',
    summary: 'One-time codes, digit inputs, and short-lived waits.',
    description: 'OTP screens train timing-sensitive waits and multi-field input. Prefer waiting for the next screen over polling blindly.',
    concepts: ['Explicit waits', 'Fluent waits', 'Keyboard events', 'Synchronization', 'POM'],
    techniques: ['Enter OTP digits', 'Handle resend cooldown if present', 'Assert navigation after valid OTP'],
    bestPractices: ['Use ExpectedConditions / expect.poll for enablement', 'Keep OTP in test data fixtures'],
    selenium: `WebElement otp = driver.findElement(By.cssSelector("[data-testid='otp-input']"));
otp.sendKeys("123456");
driver.findElement(By.cssSelector("[data-testid='otp-btn-verify']")).click();`,
    playwright: `await page.getByTestId('otp-input').fill('123456');
await page.getByTestId('otp-btn-verify').click();`,
    cypress: `cy.get('[data-testid="otp-input"]').type('123456');
cy.get('[data-testid="otp-btn-verify"]').click();`,
    suitableFor: 'Playwright auto-wait is especially nice for OTP enable/disable timing.',
  }),

  mfa: entry({
    title: 'MFA',
    summary: 'Multi-factor challenge after password login.',
    description: 'Similar to OTP but often after a primary login. Chain page objects: Login → MFA → Home.',
    concepts: ['POM', 'Explicit waits', 'Flow chaining', 'sendKeys()', 'Assertions'],
    techniques: ['Complete password login then MFA', 'Invalid MFA negative path', 'Session persistence checks'],
    bestPractices: ['Model MFA as its own page object', 'Do not bypass MFA in production tests'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='mfa-input']")).sendKeys("654321");
driver.findElement(By.cssSelector("[data-testid='mfa-btn-verify']")).click();`,
    playwright: `await page.getByTestId('mfa-input').fill('654321');
await page.getByTestId('mfa-btn-verify').click();`,
    cypress: `cy.get('[data-testid="mfa-input"]').type('654321');
cy.get('[data-testid="mfa-btn-verify"]').click();`,
    suitableFor: 'Selenium POM chains are a common interview ask; Playwright for concise E2E.',
  }),

  dashboard: entry({
    title: 'Dashboard',
    summary: 'KPI cards, charts, tables, and read-only verification.',
    description:
      'Focus on asserting rendered metrics, chart containers, and recent-activity lists. Charts are often SVG/canvas — assert wrappers and text, not pixel drawing.',
    concepts: ['CSS selectors', 'XPath', 'Assertions', 'POM', 'Synchronization'],
    techniques: [
      'Assert KPI cards under #kpi-cards',
      'Verify chart containers (#sales-line-chart) exist',
      'Read table rows for recent orders',
    ],
    bestPractices: [
      'Do not assert flaky chart pixel positions',
      'Prefer text/content assertions on KPI values',
      'Use soft asserts when checking many widgets',
    ],
    selenium: `List<WebElement> kpis = driver.findElements(By.cssSelector("[data-testid='kpi-cards'] [data-testid^='kpi-']"));
Assert.assertTrue(kpis.size() >= 4);
Assert.assertTrue(driver.findElement(By.id("sales-line-chart")).isDisplayed());`,
    playwright: `await expect(page.getByTestId('kpi-cards')).toBeVisible();
await expect(page.getByTestId('sales-line-chart')).toBeVisible();
await expect(page.getByTestId('dashboard-title')).toContainText('Dashboard');`,
    cypress: `cy.get('[data-testid="kpi-cards"]').should('be.visible');
cy.get('[data-testid="sales-line-chart"]').should('exist');
cy.get('[data-testid="dashboard-title"]').should('contain', 'Dashboard');`,
    suitableFor: 'Playwright/Cypress for rich assertions; Selenium for classic dashboard POM demos.',
  }),

  'dashboard-live': entry({
    title: 'Live Dashboard',
    summary: 'WebSocket metrics, drag-drop widgets, layout persistence.',
    description:
      'Realtime UI needs resilient waits (value changes) plus Actions / drag-and-drop for widgets. Prefer polling assertions over fixed sleeps.',
    concepts: ['Explicit waits', 'Fluent waits', 'Drag and drop', 'Actions', 'Synchronization', 'Dynamic locators'],
    techniques: [
      'Wait until a metric text changes',
      'Drag a widget to a new slot',
      'Save layout and reload to verify persistence',
    ],
    bestPractices: [
      'Use wait.until / expect.poll for streaming values',
      'Stabilize DnD with mouse.down → move → up sequences',
      'Avoid asserting exact websocket message order',
    ],
    selenium: `new WebDriverWait(driver, Duration.ofSeconds(15)).until(d -> {
  String t = d.findElement(By.cssSelector("[data-testid^='live-metric']")).getText();
  return !t.isBlank();
});
Actions a = new Actions(driver);
a.dragAndDrop(src, target).perform();`,
    playwright: `await expect.poll(async () =>
  page.getByTestId('live-metric-orders').innerText()
).not.toBe('');
await page.getByTestId('widget-a').dragTo(page.getByTestId('slot-b'));`,
    cypress: `cy.get('[data-testid^="live-metric"]', { timeout: 15000 }).should('not.be.empty');
cy.get('[data-testid="widget-a"]').trigger('mousedown', { which: 1 })
  .trigger('mousemove').trigger('mouseup');`,
    suitableFor: 'Playwright dragTo + expect.poll is usually the cleanest for live widgets.',
  }),

  users: entry({
    title: 'Users (CRUD)',
    summary: 'Search, filters, table selection, dialogs, import/export.',
    description:
      'Full CRUD grid: locate rows dynamically, open dialogs, fill forms, confirm deletes, and handle bulk selection. Strong POM candidate.',
    concepts: [
      'POM',
      'Dynamic locators',
      'XPath',
      'CSS selectors',
      'Explicit waits',
      'sendKeys()',
      'File upload/download',
      'Alerts (dialogs)',
    ],
    techniques: [
      'Search + filter then assert row count',
      'Click #users-btn-add and fill dialog fields',
      'Edit/delete via #user-edit-{id} / #user-delete-{id}',
      'Export CSV and verify download attribute/flow',
    ],
    bestPractices: [
      'Build row locators from entity id: [data-testid="user-row-123"]',
      'Wait for dialog open/close transitions',
      'Clean up created users in after hooks',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='users-btn-add']")).click();
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid='user-dialog']")));
driver.findElement(By.cssSelector("[data-testid='user-form-name']")).sendKeys("Ada Lovelace");
driver.findElement(By.cssSelector("[data-testid='user-form-save']")).click();`,
    playwright: `await page.getByTestId('users-btn-add').click();
await page.getByTestId('user-form-name').fill('Ada Lovelace');
await page.getByTestId('user-form-email').fill('ada@testui.com');
await page.getByTestId('user-form-save').click();
await expect(page.getByText('Ada Lovelace')).toBeVisible();`,
    cypress: `cy.get('[data-testid="users-btn-add"]').click();
cy.get('[data-testid="user-form-name"]').type('Ada Lovelace');
cy.get('[data-testid="user-form-save"]').click();
cy.contains('Ada Lovelace').should('be.visible');`,
    suitableFor: 'Selenium POM/Page Factory interviews; Playwright for reliable dialog + table flows.',
  }),

  products: entry({
    title: 'Products',
    summary: 'Cards grid, filters, image upload, product dialog.',
    description: 'Card-based catalog with Autocomplete filters and file inputs for images — practice upload and dynamic card locators.',
    concepts: ['File upload/download', 'Dynamic locators', 'POM', 'sendKeys()', 'CSS selectors', 'Explicit waits'],
    techniques: [
      'Filter by category Autocomplete',
      'Open product dialog and upload image via hidden input',
      'Edit/delete product cards by id',
    ],
    bestPractices: [
      'Send absolute path to <input type=file> — do not click OS dialogs',
      'Assert card by data-testid={`product-card-${id}`}',
    ],
    selenium: `WebElement file = driver.findElement(By.cssSelector("[data-testid='product-file-input']"));
file.sendKeys("/absolute/path/sample.png");
driver.findElement(By.cssSelector("[data-testid='product-form-save']")).click();`,
    playwright: `await page.getByTestId('product-file-input').setInputFiles('tests/fixtures/sample.png');
await page.getByTestId('product-form-name').fill('Widget');
await page.getByTestId('product-form-save').click();`,
    cypress: `cy.get('[data-testid="product-file-input"]').selectFile('cypress/fixtures/sample.png', { force: true });
cy.get('[data-testid="product-form-save"]').click();`,
    suitableFor: 'Playwright setInputFiles / Cypress selectFile are simplest for uploads.',
  }),

  orders: entry({
    title: 'Orders',
    summary: 'Expandable rows, nested tables, status selects, timelines.',
    description:
      'Practice expand/collapse, nested table assertions, and Select MenuItems. Status updates need waits for UI refresh.',
    concepts: ['Dynamic locators', 'CSS selectors', 'XPath', 'Explicit waits', 'POM', 'Keyboard events'],
    techniques: [
      'Click expand icon #order-expand-{id}',
      'Change status via Select options (#order-status-{id}-option-*)',
      'Assert timeline steps after expand',
    ],
    bestPractices: [
      'Wait for detail panel visibility after expand',
      'Prefer option data-testid over fragile option index XPath',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='order-expand-ORD-1']")).click();
Assert.assertTrue(driver.findElement(By.id("order-detail-ORD-1")).isDisplayed());
Select status = new Select(driver.findElement(By.cssSelector("[data-testid='order-status-ORD-1']")));
status.selectByVisibleText("shipped");`,
    playwright: `await page.getByTestId('order-expand-ORD-1').click();
await expect(page.getByTestId('order-detail-ORD-1')).toBeVisible();
await page.getByTestId('order-status-ORD-1').click();
await page.getByTestId('order-status-ORD-1-option-shipped').click();`,
    cypress: `cy.get('[data-testid="order-expand-ORD-1"]').click();
cy.get('[data-testid="order-detail-ORD-1"]').should('be.visible');
cy.get('[data-testid="order-status-ORD-1"]').click();
cy.get('[data-testid="order-status-ORD-1-option-shipped"]').click();`,
    suitableFor: 'All frameworks — MUI Select is easiest with Playwright getByRole/option testids.',
  }),

  forms: entry({
    title: 'Forms',
    summary: 'Multi-field forms, validation, selects, checkboxes, radios.',
    description:
      'Core form automation: typing, selects, checkboxes/radios, date-like fields, and validation messages. Great for sendKeys and Page Factory.',
    concepts: ['sendKeys()', 'POM', 'Page Factory', 'CSS selectors', 'Explicit waits', 'Keyboard events'],
    techniques: [
      'Fill required fields and submit',
      'Trigger validation by submitting empty form',
      'Select country MenuItem via option test id',
    ],
    bestPractices: [
      'Clear fields before type when reusing forms',
      'Assert helperText / aria-invalid for errors',
      'Tab-order tests for keyboard accessibility',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='forms-input-first-name']")).sendKeys("Test");
driver.findElement(By.cssSelector("[data-testid='forms-btn-submit']")).click();`,
    playwright: `await page.getByTestId('forms-input-first-name').fill('Test');
await page.getByTestId('forms-select-country').click();
await page.getByTestId('forms-select-country-option-in').click();
await page.getByTestId('forms-btn-submit').click();`,
    cypress: `cy.get('[data-testid="forms-input-first-name"]').type('Test');
cy.get('[data-testid="forms-btn-submit"]').click();`,
    suitableFor: 'Selenium Page Factory interviews; Playwright for complex MUI controls.',
  }),

  'forms-advanced': entry({
    title: 'Forms Advanced',
    summary: 'Conditional fields, JSON-driven forms, async validation.',
    description:
      'Fields appear/disappear based on prior answers. Practice waiting for conditional controls and handling async validation spinners.',
    concepts: ['Explicit waits', 'Fluent waits', 'Dynamic locators', 'Synchronization', 'POM'],
    techniques: [
      'Select country to reveal dependent fields',
      'Wait for async validation result',
      'Add/remove repeatable sections',
    ],
    bestPractices: [
      'Wait for attached/visible state of conditional inputs',
      'Do not click fields that are still mounting',
    ],
    selenium: `new WebDriverWait(driver, Duration.ofSeconds(10)).until(
  ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid*='forms-adv']"))
);`,
    playwright: `await page.getByTestId('forms-adv-country').click();
await page.getByTestId('forms-adv-country-option-India').click();
await expect(page.getByTestId('forms-adv-state')).toBeVisible();`,
    cypress: `cy.get('[data-testid="forms-adv-country"]').click();
cy.get('[data-testid="forms-adv-country-option-India"]').click();
cy.get('[data-testid="forms-adv-state"]').should('be.visible');`,
    suitableFor: 'Playwright auto-waiting excels for conditional forms.',
  }),

  advanced: entry({
    title: 'Advanced UI',
    summary: 'Modals, toasts, tooltips, tabs, stepper, carousel, DnD.',
    description:
      'Overlay and transient UI: dialogs, snackbars, tooltips, and drag-drop. Practice Actions and waiting for toast disappearance.',
    concepts: ['Actions', 'Mouse events', 'Drag and drop', 'Explicit waits', 'Alerts', 'Windows'],
    techniques: [
      'Open modal and assert focus trap',
      'Trigger toast and wait until visible then gone',
      'Hover for tooltip; drag list items',
    ],
    bestPractices: [
      'Wait for dialog role="dialog"',
      'Use Actions moveToElement for hover',
      'Avoid racing toast auto-hide with fixed sleeps only',
    ],
    selenium: `new Actions(driver).moveToElement(target).perform();
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[role='tooltip']")));`,
    playwright: `await page.getByTestId('advanced-tooltip-target').hover();
await expect(page.getByRole('tooltip')).toBeVisible();
await page.getByTestId('dnd-item-1').dragTo(page.getByTestId('dnd-item-3'));`,
    cypress: `cy.get('[data-testid="advanced-tooltip-target"]').trigger('mouseover');
cy.get('[role="tooltip"]').should('be.visible');`,
    suitableFor: 'Selenium Actions for interview demos; Playwright for reliable DnD.',
  }),

  tables: entry({
    title: 'Tables',
    summary: 'Sort, filter, pagination, selection, AG Grid / virtualization.',
    description:
      'Data-grid automation: header clicks for sort, pagination controls, and row selection. Virtualized rows need scroll-into-view strategies.',
    concepts: ['CSS selectors', 'XPath', 'Dynamic locators', 'Explicit waits', 'POM', 'JavaScript Executor'],
    techniques: [
      'Click column header to sort',
      'Paginate and assert page indicator',
      'Select rows via checkboxes',
      'scrollIntoView for virtual rows (JS executor)',
    ],
    bestPractices: [
      'Do not assume all rows exist in DOM (virtualization)',
      'Assert sort by reading cell texts in order',
    ],
    selenium: `((JavascriptExecutor) driver).executeScript(
  "arguments[0].scrollIntoView(true);", row);
driver.findElement(By.cssSelector("[data-testid='tables-pagination']")).isDisplayed();`,
    playwright: `await page.getByTestId('tables-sort-name').click();
await page.getByRole('row').nth(5).scrollIntoViewIfNeeded();`,
    cypress: `cy.get('[data-testid="tables-pagination"]').should('exist');
cy.get('[data-testid^="table-row-"]').first().click();`,
    suitableFor: 'Selenium JS Executor for virtual scroll interviews; Playwright scrollIntoViewIfNeeded day-to-day.',
  }),

  'enterprise-tables': entry({
    title: 'Enterprise Tables',
    summary: 'Server pagination, inline edit, master-detail, group-by, row DnD.',
    description:
      'Advanced grid patterns: wait for server-filtered results, edit cells inline, expand master-detail, and drag rows.',
    concepts: ['Explicit waits', 'Fluent waits', 'Dynamic locators', 'Drag and drop', 'Synchronization', 'POM'],
    techniques: [
      'Change page size and wait for network settle',
      'Inline-edit a cell and blur/save',
      'Group by status and assert group headers',
    ],
    bestPractices: [
      'Wait for loading indicator to disappear',
      'Use test ids on filter MenuItems (optId pattern)',
    ],
    selenium: `new WebDriverWait(driver, Duration.ofSeconds(10)).until(
  ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[data-testid='ent-table-loading']"))
);`,
    playwright: `await page.getByTestId('ent-table-filter-status').click();
await page.getByTestId('ent-table-filter-status-option-active').click();
await expect(page.getByTestId('enterprise-tables-page')).toBeVisible();`,
    cypress: `cy.get('[data-testid="ent-table-filter-status"]').click();
cy.get('[data-testid="ent-table-filter-status-option-active"]').click();`,
    suitableFor: 'Playwright for network-idle + grid interactions.',
  }),

  tree: entry({
    title: 'Tree View',
    summary: 'Expand/collapse nodes, lazy load children.',
    description: 'Hierarchical UI: expand nodes, wait for lazy children, assert aria-expanded.',
    concepts: ['Explicit waits', 'Dynamic locators', 'CSS selectors', 'Keyboard events', 'Synchronization'],
    techniques: ['Expand root then child', 'Keyboard Right/Left to expand/collapse', 'Assert lazy-loaded nodes'],
    bestPractices: ['Wait for child nodes after expand', 'Prefer role=treeitem when available'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='tree-node-root']")).click();
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid^='tree-node-']")));`,
    playwright: `await page.getByTestId('tree-node-root').click();
await expect(page.getByTestId('tree-node-documents')).toBeVisible();`,
    cypress: `cy.get('[data-testid="tree-node-root"]').click();
cy.get('[data-testid^="tree-node-"]').should('have.length.greaterThan', 1);`,
    suitableFor: 'All frameworks — good for aria-expanded assertions.',
  }),

  workflow: entry({
    title: 'Workflow (DnD)',
    summary: 'Kanban-style drag and drop between columns.',
    description: 'Primary focus: HTML5 / pointer drag-and-drop and verifying card column changes.',
    concepts: ['Drag and drop', 'Actions', 'Mouse events', 'Explicit waits', 'Dynamic locators'],
    techniques: [
      'Drag card from To Do → In Progress',
      'Assert card parent column after drop',
      'Undo/reset board if available',
    ],
    bestPractices: [
      'Prefer framework DnD helpers over raw coordinates when possible',
      'Assert by column container test id, not pixel position',
    ],
    selenium: `new Actions(driver).clickAndHold(card).moveToElement(column).release().perform();`,
    playwright: `await page.getByTestId('wf-card-1').dragTo(page.getByTestId('wf-column-done'));
await expect(page.getByTestId('wf-column-done').getByTestId('wf-card-1')).toBeVisible();`,
    cypress: `const dataTransfer = new DataTransfer();
cy.get('[data-testid="wf-card-1"]').trigger('dragstart', { dataTransfer });
cy.get('[data-testid="wf-column-done"]').trigger('drop', { dataTransfer });`,
    suitableFor: 'Playwright dragTo is usually most reliable; Selenium Actions for interviews.',
  }),

  reports: entry({
    title: 'Reports',
    summary: 'Charts, date filters, export actions.',
    description: 'Filter report range, assert chart presence, and trigger exports.',
    concepts: ['POM', 'File download', 'CSS selectors', 'Explicit waits', 'Assertions'],
    techniques: ['Apply filters', 'Assert chart containers', 'Click export and verify download'],
    bestPractices: ['Configure browser download dir in Selenium/Playwright', 'Assert file name/extension'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='reports-btn-export']")).click();`,
    playwright: `const [ download ] = await Promise.all([
  page.waitForEvent('download'),
  page.getByTestId('reports-btn-export').click(),
]);
await download.saveAs('out/report.csv');`,
    cypress: `cy.get('[data-testid="reports-btn-export"]').click();
cy.readFile('cypress/downloads/report.csv', { timeout: 15000 }).should('exist');`,
    suitableFor: 'Playwright download events are excellent for export verification.',
  }),

  settings: entry({
    title: 'Settings',
    summary: 'Theme, language, profile fields, password change, a11y toggles.',
    description: 'Toggle theme/language and update profile. Assert persisted UI changes after reload when applicable.',
    concepts: ['POM', 'sendKeys()', 'CSS selectors', 'Explicit waits', 'Keyboard events'],
    techniques: [
      'Toggle light/dark via #theme-light / #theme-dark',
      'Change language Select options',
      'Update profile and assert success Alert',
    ],
    bestPractices: ['Reload to verify persistence', 'Isolate theme tests (visual + attribute checks)'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='theme-dark']")).click();
driver.findElement(By.cssSelector("[data-testid='profile-save']")).click();`,
    playwright: `await page.getByTestId('theme-dark').click();
await page.getByTestId('language-switch').click();
await page.getByTestId('language-switch-option-es').click();`,
    cypress: `cy.get('[data-testid="theme-dark"]').click();
cy.get('[data-testid="profile-name"]').clear().type('QA User');
cy.get('[data-testid="profile-save"]').click();`,
    suitableFor: 'Any framework — good for persistence + form assertions.',
  }),

  notifications: entry({
    title: 'Notifications',
    summary: 'List, mark read, filters, live updates.',
    description: 'Practice list interactions, badge counts, and optional realtime updates.',
    concepts: ['Explicit waits', 'Dynamic locators', 'POM', 'Synchronization', 'CSS selectors'],
    techniques: ['Mark all read', 'Filter unread', 'Assert badge count changes'],
    bestPractices: ['Wait for list refresh after actions', 'Assert by notification id test ids'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='notifications-mark-all']")).click();`,
    playwright: `await page.getByTestId('notifications-mark-all').click();
await expect(page.getByTestId('header-badge-notifications')).toHaveText('0');`,
    cypress: `cy.get('[data-testid="notifications-mark-all"]').click();`,
    suitableFor: 'Playwright for badge text assertions across header + page.',
  }),

  calendar: entry({
    title: 'Calendar',
    summary: 'Events, recurrence, date picking, modal create/edit.',
    description: 'Calendar grids + event dialogs. Date cells often need title/aria locators; recurrence uses Select options.',
    concepts: ['Mouse events', 'Dynamic locators', 'Explicit waits', 'POM', 'CSS selectors'],
    techniques: ['Click a day cell to open dialog', 'Set recurrence MenuItem', 'Edit/delete event'],
    bestPractices: ['Prefer aria-label on day buttons', 'Stabilize timezone-dependent tests'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='event-freq']")).click();
driver.findElement(By.cssSelector("[data-testid='event-freq-option-weekly']")).click();`,
    playwright: `await page.getByTestId('event-freq').click();
await page.getByTestId('event-freq-option-weekly').click();`,
    cypress: `cy.get('[data-testid="event-freq"]').click();
cy.get('[data-testid="event-freq-option-weekly"]').click();`,
    suitableFor: 'Playwright getByRole for calendar day buttons.',
  }),

  files: entry({
    title: 'File Manager',
    summary: 'Upload, download, rename, preview, breadcrumbs.',
    description: 'File I/O automation: upload via input, download verification, rename dialogs, breadcrumb navigation.',
    concepts: ['File upload/download', 'POM', 'sendKeys()', 'Explicit waits', 'CSS selectors'],
    techniques: [
      'Upload via #file-upload-input',
      'Download and assert file',
      'Rename with dialog confirm',
      'Navigate breadcrumbs',
    ],
    bestPractices: [
      'Never automate native OS file chooser UI — set input files',
      'Use unique filenames to avoid collisions',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='file-upload-input']"))
  .sendKeys("/absolute/path/demo.txt");`,
    playwright: `await page.getByTestId('file-upload-input').setInputFiles('tests/fixtures/demo.txt');
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByTestId('file-download-1').click(),
]);`,
    cypress: `cy.get('[data-testid="file-upload-input"]').selectFile('cypress/fixtures/demo.txt', { force: true });`,
    suitableFor: 'Playwright/Cypress for uploads & downloads; Selenium sendKeys(path) classic interview answer.',
  }),

  ecommerce: entry({
    title: 'E-Commerce',
    summary: 'Shop, cart qty, wishlist, checkout steps, payment radios.',
    description:
      'Multi-step checkout: add to cart, update qty, choose payment method (radios), place order. Good end-to-end POM flow.',
    concepts: ['POM', 'Explicit waits', 'CSS selectors', 'sendKeys()', 'Keyboard events', 'Synchronization'],
    techniques: [
      'Add product via #add-cart-{id}',
      'Update cart qty fields',
      'Select payment radio #payment-card',
      'Complete stepper and assert success',
    ],
    bestPractices: [
      'Model Shop, Cart, Checkout as separate page objects',
      'Assert order total before Place Order',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='add-cart-1']")).click();
driver.findElement(By.cssSelector("[data-testid='goto-checkout']")).click();
driver.findElement(By.cssSelector("[data-testid='payment-card']")).click();
driver.findElement(By.cssSelector("[data-testid='place-order']")).click();`,
    playwright: `await page.getByTestId('add-cart-1').click();
await page.getByTestId('goto-checkout').click();
await page.getByTestId('payment-card').check();
await page.getByTestId('place-order').click();
await expect(page.getByTestId('checkout-success')).toBeVisible();`,
    cypress: `cy.get('[data-testid="add-cart-1"]').click();
cy.get('[data-testid="goto-cart"]').click();
cy.get('[data-testid="goto-checkout"]').click();
cy.get('[data-testid="payment-card"]').check({ force: true });
cy.get('[data-testid="place-order"]').click();`,
    suitableFor: 'All frameworks — Playwright for clean multi-step E2E.',
  }),

  network: entry({
    title: 'Network Simulation',
    summary: 'Offline, latency, failed requests, retry UX.',
    description: 'Toggle offline/slow network and assert banners, spinners, and error recovery.',
    concepts: ['Synchronization', 'Explicit waits', 'Fluent waits', 'POM', 'JavaScript Executor'],
    techniques: ['Enable offline and assert #offline-banner / page alerts', 'Trigger retry after failure'],
    bestPractices: ['Use CDP/route mocking in Playwright/Cypress when possible', 'Reset network state in afterEach'],
    selenium: `// Often combined with proxy or driver network conditions
Assert.assertTrue(driver.findElement(By.cssSelector("[data-testid='offline-banner']")).isDisplayed());`,
    playwright: `await context.setOffline(true);
await page.reload();
await expect(page.getByTestId('offline-banner')).toBeVisible();
await context.setOffline(false);`,
    cypress: `cy.intercept('/api/**', { forceNetworkError: true });
cy.get('[data-testid="network-btn-fetch"]').click();
cy.contains(/failed|offline|error/i).should('be.visible');`,
    suitableFor: 'Playwright context.setOffline / Cypress intercept are strongest.',
  }),

  errors: entry({
    title: 'Error Pages',
    summary: '404, 403, 500, empty states.',
    description: 'Assert status pages and empty-state CTAs. Useful for negative-path suites.',
    concepts: ['Assertions', 'CSS selectors', 'POM', 'Navigation'],
    techniques: ['Navigate to unknown route → 404', 'Assert empty-state title/CTA'],
    bestPractices: ['Keep negative tests isolated', 'Assert both message and recovery link'],
    selenium: `driver.get(base + "/this-route-does-not-exist");
Assert.assertTrue(driver.getPageSource().contains("404") || driver.findElement(By.cssSelector("[data-testid*='404']")).isDisplayed());`,
    playwright: `await page.goto('/missing-page');
await expect(page.getByText(/404|not found/i)).toBeVisible();`,
    cypress: `cy.visit('/missing-page', { failOnStatusCode: false });
cy.contains(/404|not found/i).should('be.visible');`,
    suitableFor: 'Any framework.',
  }),

  ai: entry({
    title: 'AI Playground',
    summary: 'Streaming responses, stop, regenerate, copy, feedback.',
    description: 'Streaming UIs need fluent/polling waits until tokens finish. Practice stop mid-stream and clipboard copy.',
    concepts: ['Fluent waits', 'Explicit waits', 'Synchronization', 'Keyboard events', 'JavaScript Executor'],
    techniques: [
      'Send prompt via #ai-input',
      'Wait until streaming completes',
      'Click stop mid-stream',
      'Copy / like / dislike actions',
    ],
    bestPractices: [
      'Poll for assistant message completion indicator',
      'Do not assert exact streamed wording if non-deterministic',
    ],
    selenium: `driver.findElement(By.cssSelector("[data-testid='ai-input']")).sendKeys("Hello");
driver.findElement(By.cssSelector("[data-testid='ai-btn-send']")).click();
new WebDriverWait(driver, Duration.ofSeconds(30)).until(
  ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[data-testid='ai-btn-stop']"))
);`,
    playwright: `await page.getByTestId('ai-input').fill('Hello');
await page.getByTestId('ai-btn-send').click();
await expect(page.getByTestId('ai-btn-stop')).toBeVisible();
await page.getByTestId('ai-btn-stop').click();`,
    cypress: `cy.get('[data-testid="ai-input"]').type('Hello');
cy.get('[data-testid="ai-btn-send"]').click();
cy.get('[data-testid="ai-btn-stop"]', { timeout: 30000 }).should('exist');`,
    suitableFor: 'Playwright expect.poll for streaming completion.',
  }),

  automation: entry({
    title: 'Automation Lab',
    summary: 'Frames, Shadow DOM, alerts, windows, keyboard, context menu.',
    description:
      'Interview classic lab: iframes, shadow roots, JS alerts, new windows, Actions, and keyboard chords.',
    concepts: [
      'Frames',
      'Shadow DOM',
      'Alerts',
      'Windows',
      'Actions',
      'Keyboard events',
      'Mouse events',
      'JavaScript Executor',
      'Explicit waits',
    ],
    techniques: [
      'switchTo().frame / frameLocator',
      'Pierce shadow DOM for inner controls',
      'Accept/dismiss alerts; assert alert text',
      'Handle new window/tab handles',
    ],
    bestPractices: [
      'Always switch back to default content after frames',
      'Prefer Playwright frameLocator / locator piercing',
      'Close extra windows in cleanup',
    ],
    selenium: `driver.switchTo().frame("lab-iframe");
driver.findElement(By.cssSelector("[data-testid='frame-btn']")).click();
driver.switchTo().defaultContent();
driver.findElement(By.cssSelector("[data-testid='alert-btn']")).click();
Alert a = driver.switchTo().alert(); a.accept();
SearchContext shadow = driver.findElement(By.cssSelector("#host")).getShadowRoot();
shadow.findElement(By.cssSelector("[data-testid='shadow-btn']")).click();`,
    playwright: `await page.frameLocator('#lab-iframe').getByTestId('frame-btn').click();
page.once('dialog', async (d) => { await d.accept(); });
await page.getByTestId('alert-btn').click();
await page.locator('#host').locator('[data-testid="shadow-btn"]').click();`,
    cypress: `cy.get('#lab-iframe').its('0.contentDocument.body').find('[data-testid="frame-btn"]').click();
cy.get('[data-testid="alert-btn"]').click();
cy.on('window:alert', cy.stub());`,
    suitableFor: 'Selenium for classic switchTo interviews; Playwright for modern piercing APIs.',
  }),

  'test-runner': entry({
    title: 'Automation Test Runner',
    summary: 'Run Selenium/Playwright suites from TestUi and inspect logs, reports, and framework structure.',
    description:
      'In-app runner that starts Maven TestNG suites for the Java Selenium and Playwright projects, streams live logs, and surfaces Extent/Surefire reports plus screenshots. Use the Framework Structure tab to review packages, page objects, test classes, and the architecture diagram.',
    concepts: [
      'TestNG suites',
      'Maven profiles',
      'POM framework layout',
      'Extent reports',
      'Live log streaming (SSE)',
      'Headless browser execution',
      'Module vs application suites',
    ],
    techniques: [
      'Select framework (Selenium or Playwright)',
      'Pick application or module suite XML',
      'Configure browser / headless / baseUrl',
      'Start/stop runs and watch /api/runner SSE logs',
      'Open Extent HTML and failure screenshots',
      'Browse Java classes and architecture diagram',
    ],
    bestPractices: [
      'Keep TestUi (npm run dev) up so baseUrl is reachable',
      'Prefer smoke/module suites before full regression',
      'Use headless=true for CI-like local runs',
      'Only one Maven run at a time from the UI',
    ],
    selenium: `// Triggered by TestUi runner (equivalent CLI):
// cd automation/selenium-java
// mvn test -DsuiteXmlFile=src/test/resources/suites/modules/login/smoke.xml \\
//   -Dbrowser=chrome -Dheadless=true -DbaseUrl=http://localhost:5173
// UI: #runner-btn-start , logs: #runner-log-console`,
    playwright: `// Triggered by TestUi runner (equivalent CLI):
// cd automation/playwright-java
// mvn test -DsuiteXmlFile=src/test/resources/suites/smoke.xml \\
//   -Dbrowser=chromium -Dheadless=true -DbaseUrl=http://localhost:5173
// UI: #runner-framework → playwright, then #runner-btn-start`,
    cypress: `// N/A — this runner executes Java Maven suites (Selenium/Playwright).
// Cypress practice remains on Playground / Automation Lab pages.`,
    suitableFor: 'Operating the Java frameworks end-to-end from TestUi; Selenium for full module coverage, Playwright for smoke/regression starter suites.',
  }),

  playground: entry({
    title: 'Playground 100+',
    summary: 'Dynamic IDs, waits, shadow, frames, flaky, virtual lists, and more.',
    description:
      'Isolated hard scenarios: dynamic attributes, delayed elements, nested frames/shadow, flaky clicks, infinite scroll. Pick the matching technique per tab.',
    concepts: [
      'Dynamic locators',
      'Explicit waits',
      'Fluent waits',
      'Shadow DOM',
      'Frames',
      'JavaScript Executor',
      'Synchronization',
      'XPath',
      'CSS selectors',
    ],
    techniques: [
      'Locate by stable data-testid even when class/id randomizes',
      'Wait for delayed appear / clickability',
      'Scroll virtual lists into view',
      'Retry flaky actions carefully (or fix app)',
    ],
    bestPractices: [
      'Prefer stable test ids over dynamic ids',
      'Use FluentWait ignoring NoSuchElement for transient nodes',
      'Document which tab each test covers',
    ],
    selenium: `Wait<WebDriver> fluent = new FluentWait<>(driver)
  .withTimeout(Duration.ofSeconds(20))
  .pollingEvery(Duration.ofMillis(500))
  .ignoring(NoSuchElementException.class);
fluent.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='pg-btn-delayed-appear']")));`,
    playwright: `await page.getByTestId('pg-btn-delayed-appear').click({ timeout: 20000 });
await page.getByTestId('pg-select-dynamic').click();
await page.getByTestId('pg-select-dynamic-option-beta').click();`,
    cypress: `cy.get('[data-testid="pg-btn-delayed-appear"]', { timeout: 20000 }).click();
cy.get('[data-testid="pg-virtual-row-500"]').scrollIntoView().should('be.visible');`,
    suitableFor: 'Use all three — this page is built for interview technique drills.',
  }),

  'auth-advanced': entry({
    title: 'Auth Advanced',
    summary: 'SSO, OAuth, JWT, lockout, biometric stubs, sessions.',
    description: 'Advanced auth flows and lockout counters. Mock redirects where real IdP is unavailable.',
    concepts: ['POM', 'Windows', 'Explicit waits', 'Synchronization', 'CSS selectors'],
    techniques: ['Trigger SSO button and assert stubbed state', 'Force lockout and assert message', 'Inspect session list'],
    bestPractices: ['Stub OAuth with route mocking', 'Reset lockout state between tests'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='auth-btn-sso']")).click();`,
    playwright: `await page.route('**/oauth/**', (route) => route.fulfill({ status: 200, body: '{}' }));
await page.getByTestId('auth-btn-sso').click();`,
    cypress: `cy.intercept('**/oauth/**', { statusCode: 200, body: {} });
cy.get('[data-testid="auth-btn-sso"]').click();`,
    suitableFor: 'Playwright/Cypress route mocking for OAuth stubs.',
  }),

  'api-sim': entry({
    title: 'API Simulation',
    summary: 'Mock 401/404/500/timeout/offline responses.',
    description: 'Drive UI against simulated API outcomes; assert error toasts and retry.',
    concepts: ['Synchronization', 'Explicit waits', 'POM', 'Fluent waits'],
    techniques: ['Pick scenario Select option', 'Trigger request', 'Assert UI error state'],
    bestPractices: ['Pair UI asserts with network asserts when possible'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='api-sim-scenario']")).click();
driver.findElement(By.cssSelector("[data-testid='api-sim-scenario-option-500']")).click();`,
    playwright: `await page.getByTestId('api-sim-scenario').click();
await page.getByTestId('api-sim-scenario-option-500').click();
await page.getByTestId('api-sim-btn-run').click();`,
    cypress: `cy.get('[data-testid="api-sim-btn-run"]').click();
cy.contains(/500|error|failed/i).should('be.visible');`,
    suitableFor: 'Cypress intercept + Playwright route for API-layer control.',
  }),

  storage: entry({
    title: 'Browser Storage',
    summary: 'localStorage, sessionStorage, cookies, IndexedDB.',
    description: 'Validate UI that reads/writes storage. Use JS executor / addInitScript to seed state.',
    concepts: ['JavaScript Executor', 'POM', 'Assertions', 'Synchronization'],
    techniques: ['Set a key via UI and read back', 'Clear storage and assert empty state', 'Cookie create/delete'],
    bestPractices: ['Isolate storage per test', 'Prefer API helpers over UI for setup when testing reads'],
    selenium: `((JavascriptExecutor) driver).executeScript("localStorage.setItem('demo','1');");
driver.navigate().refresh();`,
    playwright: `await page.evaluate(() => localStorage.setItem('demo', '1'));
await page.reload();
await expect(page.getByTestId('storage-value-demo')).toContainText('1');`,
    cypress: `cy.window().then((win) => win.localStorage.setItem('demo', '1'));
cy.reload();`,
    suitableFor: 'All frameworks support storage APIs well.',
  }),

  'browser-apis': entry({
    title: 'Browser APIs',
    summary: 'Clipboard, notifications, geolocation, media, fullscreen.',
    description: 'Grant permissions in browser context and assert API-driven UI feedback.',
    concepts: ['JavaScript Executor', 'Explicit waits', 'POM', 'Mouse events'],
    techniques: ['Clipboard write/read stubs', 'Geolocation mock', 'Fullscreen toggle'],
    bestPractices: ['Configure permissions in Playwright context', 'Stub Notification API in unit/E2E'],
    selenium: `// Capabilities / CDP for geolocation mocks vary by driver
driver.findElement(By.cssSelector("[data-testid='browser-btn-clipboard']")).click();`,
    playwright: `await context.grantPermissions(['clipboard-read', 'clipboard-write', 'geolocation']);
await context.setGeolocation({ latitude: 12.97, longitude: 77.59 });
await page.getByTestId('browser-btn-geo').click();`,
    cypress: `cy.window().then((win) => {
  cy.stub(win.navigator.clipboard, 'writeText').resolves();
});
cy.get('[data-testid="browser-btn-clipboard"]').click();`,
    suitableFor: 'Playwright permission APIs are the most straightforward.',
  }),

  uploads: entry({
    title: 'Uploads',
    summary: 'Multi-file, drag-drop upload, progress, cancel/resume.',
    description: 'Advanced upload UX: multiple files, progress bars, cancel. Avoid native OS dialogs.',
    concepts: ['File upload/download', 'Drag and drop', 'Explicit waits', 'Synchronization', 'POM'],
    techniques: ['selectFile / setInputFiles multi', 'Assert progress then success', 'Cancel mid-upload'],
    bestPractices: ['Use fixtures with known sizes', 'Wait for progress=100 or success chip'],
    selenium: `driver.findElement(By.cssSelector("input[type='file']"))
  .sendKeys("/a/one.txt\\n/a/two.txt");`,
    playwright: `await page.getByTestId('uploads-input').setInputFiles(['f1.txt', 'f2.txt']);
await expect(page.getByTestId('uploads-progress')).toHaveAttribute('aria-valuenow', '100');`,
    cypress: `cy.get('[data-testid="uploads-input"]').selectFile(['a.txt', 'b.txt'], { force: true });`,
    suitableFor: 'Playwright/Cypress for multi-file uploads.',
  }),

  downloads: entry({
    title: 'Downloads',
    summary: 'PDF, Excel, CSV, ZIP — verify name/size/type.',
    description: 'Assert download events and file metadata rather than opening native viewers.',
    concepts: ['File upload/download', 'Explicit waits', 'POM', 'Assertions'],
    techniques: ['Click download buttons', 'Assert suggested filename', 'Verify non-empty file size'],
    bestPractices: ['Use framework download listeners', 'Clean download folder in CI'],
    selenium: `// Configure ChromeOptions download directory + wait for file existence
Path dir = Paths.get("/tmp/downloads");
Awaitility.await().until(() -> Files.list(dir).findAny().isPresent());`,
    playwright: `const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByTestId('download-btn-csv').click(),
]);
expect(download.suggestedFilename()).toMatch(/\\.csv$/);`,
    cypress: `cy.get('[data-testid="download-btn-csv"]').click();
cy.readFile('cypress/downloads/export.csv').should('exist');`,
    suitableFor: 'Playwright waitForEvent("download") is ideal.',
  }),

  admin: entry({
    title: 'Admin',
    summary: 'Audit logs, roles matrix, sessions.',
    description: 'Tabbed admin tables — filter logs and assert permission matrix cells.',
    concepts: ['POM', 'CSS selectors', 'Dynamic locators', 'Explicit waits'],
    techniques: ['Switch tabs', 'Assert audit row fields', 'Revoke session action'],
    bestPractices: ['Scope selectors within active tab panel'],
    selenium: `driver.findElement(By.cssSelector("[data-testid='admin-tab-sessions']")).click();`,
    playwright: `await page.getByTestId('admin-tab-sessions').click();
await expect(page.getByTestId('admin-sessions-table')).toBeVisible();`,
    cypress: `cy.get('[data-testid="admin-tab-sessions"]').click();
cy.get('[data-testid="admin-sessions-table"]').should('be.visible');`,
    suitableFor: 'Any framework.',
  }),

  search: entry({
    title: 'Search',
    summary: 'Suggestions, highlight, saved/recent queries.',
    description: 'Typeahead needs debounced waits; assert suggestion list and highlighted results.',
    concepts: ['Explicit waits', 'Fluent waits', 'Keyboard events', 'Dynamic locators', 'POM'],
    techniques: ['Type query and wait for suggestions', 'Arrow-key select suggestion', 'Assert highlighted matches'],
    bestPractices: ['Wait for suggestion list after debounce', 'Do not assert too quickly after each keypress'],
    selenium: `WebElement q = driver.findElement(By.cssSelector("[data-testid='search-input']"));
q.sendKeys("user");
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid='search-suggestions']")));`,
    playwright: `await page.getByTestId('search-input').fill('user');
await expect(page.getByTestId('search-suggestions')).toBeVisible();`,
    cypress: `cy.get('[data-testid="search-input"]').type('user');
cy.get('[data-testid="search-suggestions"]').should('be.visible');`,
    suitableFor: 'Playwright/Cypress auto-retry helps with debounce timing.',
  }),

  a11y: entry({
    title: 'Accessibility',
    summary: 'ARIA, keyboard-only, focus, contrast, alt text.',
    description: 'Combine UI automation with a11y checks (axe) and keyboard navigation without a mouse.',
    concepts: ['Keyboard events', 'Actions', 'CSS selectors', 'POM', 'Assertions'],
    techniques: ['Tab through controls and assert focus', 'Toggle high-contrast switch', 'Assert aria-labels on icons'],
    bestPractices: ['Use getByRole where possible', 'Integrate axe-core for automated a11y scans'],
    selenium: `new Actions(driver).sendKeys(Keys.TAB).perform();
WebElement active = driver.switchTo().activeElement();
Assert.assertEquals("expected-id", active.getAttribute("id"));`,
    playwright: `await page.keyboard.press('Tab');
await expect(page.locator(':focus')).toHaveAttribute('data-testid', /a11y-/);
// + @axe-core/playwright scan`,
    cypress: `cy.get('body').tab();
cy.focused().should('have.attr', 'data-testid');
// cypress-axe: cy.injectAxe(); cy.checkA11y();`,
    suitableFor: 'Playwright getByRole + axe; Cypress-axe plugins are popular too.',
  }),

  performance: entry({
    title: 'Performance Lab',
    summary: '10k rows, lazy load, artificial delays.',
    description: 'Large lists require scroll + wait strategies. Measure timings carefully; avoid overly strict CI thresholds.',
    concepts: ['JavaScript Executor', 'Explicit waits', 'Fluent waits', 'Synchronization', 'Dynamic locators'],
    techniques: ['Scroll to load more rows', 'Assert row count growth', 'Tolerate network/CPU delay toggles'],
    bestPractices: ['Scroll in chunks; wait for new nodes', 'Keep performance asserts as trends, not single hard numbers'],
    selenium: `((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight)");
new WebDriverWait(driver, Duration.ofSeconds(15)).until(d ->
  d.findElements(By.cssSelector("[data-testid^='perf-row-']")).size() > 50);`,
    playwright: `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await expect.poll(async () => page.locator('[data-testid^="perf-row-"]').count()).toBeGreaterThan(50);`,
    cypress: `cy.scrollTo('bottom');
cy.get('[data-testid^="perf-row-"]').should('have.length.greaterThan', 50);`,
    suitableFor: 'Playwright expect.poll for growing lists.',
  }),

  'charts-gallery': entry({
    title: 'Charts Gallery',
    summary: 'Multiple chart types, tooltips, legend, export.',
    description: 'Assert chart containers and tooltip on hover; avoid brittle SVG path asserts.',
    concepts: ['Mouse events', 'Actions', 'CSS selectors', 'Assertions', 'POM'],
    techniques: ['Hover series to show tooltip', 'Toggle legend', 'Export if available'],
    bestPractices: ['Assert wrapper test ids and visible legend text', 'Skip pixel-diff unless required'],
    selenium: `new Actions(driver).moveToElement(chart).perform();`,
    playwright: `await page.getByTestId('chart-bar').hover();
await expect(page.getByRole('tooltip')).toBeVisible();`,
    cypress: `cy.get('[data-testid="chart-bar"]').trigger('mouseover');`,
    suitableFor: 'Playwright hover + role=tooltip.',
  }),

  'canvas-lab': entry({
    title: 'Canvas Lab',
    summary: 'Signature / paint on canvas, export PNG.',
    description: 'Canvas drawing uses mouse down/move/up coordinate actions; export validates download.',
    concepts: ['Mouse events', 'Actions', 'JavaScript Executor', 'File download', 'POM'],
    techniques: ['Draw signature path', 'Clear canvas', 'Export PNG and assert download'],
    bestPractices: [
      'Use offset coordinates relative to canvas bounding box',
      'Assert export event rather than reading pixels unless needed',
    ],
    selenium: `Actions a = new Actions(driver);
a.moveToElement(canvas, 10, 10).clickAndHold().moveByOffset(80, 40).release().perform();`,
    playwright: `const box = await page.getByTestId('canvas-main').boundingBox();
await page.mouse.move(box.x + 10, box.y + 10);
await page.mouse.down();
await page.mouse.move(box.x + 120, box.y + 60);
await page.mouse.up();`,
    cypress: `cy.get('[data-testid="canvas-main"]')
  .trigger('mousedown', 10, 10)
  .trigger('mousemove', 120, 60)
  .trigger('mouseup');`,
    suitableFor: 'Selenium Actions / Playwright mouse API for interview drawing tasks.',
  }),

  /** Sidebar Modules / Advanced Modules navigation */
  nav: entry({
    title: 'Sidebar Menus',
    summary: 'Automate Modules & Advanced Modules links, toggles, and active states.',
    description:
      'Practice locating sidebar menu options by stable nav ids (#nav-link-*), expanding Modules / Advanced Modules sections, and asserting the selected route. Prefer data-testid over text that may change with i18n.',
    concepts: [
      'CSS selectors',
      'XPath',
      'Page Object Model (POM)',
      'Explicit waits',
      'Dynamic locators',
      'Keyboard events',
    ],
    techniques: [
      'Expand #nav-modules-toggle / #nav-advanced-toggle if collapsed',
      'Click menu option e.g. #nav-link-users, #nav-link-playground',
      'Assert URL and Mui-selected state after navigation',
      'Use header menus: #header-btn-user-menu, #header-menu-settings',
    ],
    bestPractices: [
      'Keep nav locators in a shared NavPage / Menu component object',
      'Do not rely on menu label text alone when ids exist',
      'Wait for main content (#main-content) after each menu click',
      'On mobile, open sidebar first via #header-btn-sidebar-toggle',
    ],
    selenium: `// Expand Advanced Modules if needed, then open Playground
driver.findElement(By.cssSelector("[data-testid='nav-advanced-toggle']")).click();
WebElement link = new WebDriverWait(driver, Duration.ofSeconds(5)).until(
  ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='nav-link-playground']"))
);
link.click();
new WebDriverWait(driver, Duration.ofSeconds(5))
  .until(ExpectedConditions.urlContains("/playground"));`,
    playwright: `await page.getByTestId('nav-advanced-toggle').click();
await page.getByTestId('nav-link-playground').click();
await expect(page).toHaveURL(/playground/);
await expect(page.getByTestId('nav-link-playground')).toHaveAttribute('aria-current', /page|true/).catch(async () => {
  await expect(page.getByTestId('main-content')).toBeVisible();
});`,
    cypress: `cy.get('[data-testid="nav-advanced-toggle"]').click();
cy.get('[data-testid="nav-link-playground"]').click();
cy.url().should('include', '/playground');
cy.get('[data-testid="main-content"]').should('be.visible');`,
    suitableFor: 'All frameworks — build a reusable Nav / Menu page object used by every test.',
  }),
}

/** Map route path segments / short nav names → catalog keys */
const HELP_ALIASES = {
  nav: 'nav',
  menus: 'nav',
  sidebar: 'nav',
  menu: 'nav',
  charts: 'charts-gallery',
  canvas: 'canvas-lab',
  'file-manager': 'files',
  'tree-view': 'tree',
  'network-sim': 'network',
  'error-pages': 'errors',
  'ai-playground': 'ai',
  'automation-lab': 'automation',
  'playground-100': 'playground',
}

/**
 * Resolve help for a pageId or route path (e.g. "/charts", "nav-link-users").
 */
export function getAutomationHelp(pageIdOrPath) {
  if (!pageIdOrPath) return DEFAULT

  let key = String(pageIdOrPath).trim()
  if (key.startsWith('/')) key = key.replace(/^\//, '').split('/')[0]
  if (key.startsWith('nav-link-')) key = key.replace(/^nav-link-/, '')

  key = HELP_ALIASES[key] || key

  if (AUTOMATION_HELP[key]) return AUTOMATION_HELP[key]

  return {
    ...DEFAULT,
    title: key
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  }
}
