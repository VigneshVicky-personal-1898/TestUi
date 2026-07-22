# TestUi — Enterprise UI Automation Playground

<!--
AI-ASSISTED: Cursor
PROMPT: Document deployed TestUI runner with git artifact storage
ACCEPTED-BY: vignesh
-->

React 19 + Vite + MUI app for practicing **Selenium, Playwright, Cypress, WebDriverIO, and AI automation** interview scenarios.

Includes an **Automation Test Runner** (`/api/runner`) so Selenium / Playwright Maven suites can be executed from the UI — locally or on a deployed host — with logs, reports, and screenshots stored under `automation/runs/` and optionally committed back to Git.

## Quick start

```bash
cd TestUi
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run suites from the UI

1. Log in (e.g. `admin@gmail.com` / `admin@123`)
2. Open **Advanced Modules → Test Runner** (`/test-runner`)
3. Choose **Selenium** or **Playwright**, pick a suite / module, set **Visible/Headless**, then **Run Suite**
4. Watch **Live Logs**, then open **Reports & Screenshots**
5. Use **Framework Structure** for the architecture diagram and Java class browser

CLI equivalent still works under `automation/selenium-java` and `automation/playwright-java`.

## Deploy from Git (production)

Static Git hosting alone cannot spawn Maven. Deploy TestUI on a host with **Node 20+, JDK 17+, Maven, and Chrome/Chromium**, then:

```bash
git clone https://version.onebill.net/onebill/QE_Engine.git
cd QE_Engine/TestUi
npm install
npm run build
cp .env.runner.example .env.runner   # edit values
set -a && source .env.runner && set +a
npm start                            # serves dist/ + /api/runner on PORT (default 4173)
```

Open the deployed URL → **Test Runner**. Base URL defaults to the deployment origin so suites hit the same app.

### Persist results in Git

Each run writes:

```
TestUi/automation/runs/<runId>/
  summary.json
  logs.txt / logs.json
  reports/          # Extent HTML copies
  screenshots/      # failure screenshots
  surefire/         # TestNG/Surefire HTML
  artifacts.json
automation/runs/index.json
```

Enable sync on the deploy host (see `.env.runner.example`):

| Variable | Purpose |
|----------|---------|
| `RUNNER_GIT_SYNC=true` | Commit `automation/runs` after each run |
| `RUNNER_GIT_PUSH=true` | Push to `RUNNER_GIT_REMOTE` |
| `RUNNER_GIT_REMOTE=origin` | Remote name |
| `RUNNER_GIT_BRANCH=` | Empty = current branch |
| `RUNNER_GIT_REPO_URL=` | Shown in the UI |

The host checkout must allow `git commit` / `git push` (SSH key or credential helper). The Test Runner also has a **Commit / push** vs **Disk only** toggle per run.

## Demo accounts

| Email | Password | Notes |
|-------|----------|--------|
| `admin@gmail.com` | `admin@123` | Full access |
| `manager@testui.com` | `Manager@123` | MFA `654321` |
| `employee@testui.com` | `Employee@123` | OTP `123456` |
| `viewer@testui.com` | `Viewer@123` | Read-only RBAC |

Captcha: **`TEST`**

## Module map (interview coverage)

| Area | Routes / pages |
|------|----------------|
| Auth | Login, OTP, MFA, **Auth Advanced** (SSO/OAuth/JWT/lock/biometric/sessions) |
| Dashboards | Dashboard, **Live Dashboard** (WS + widget DnD/resize/save) |
| Data grids | Tables, **Enterprise Tables** (server page/filter, inline edit, master-detail, group, aggregates, sticky cols, row DnD) |
| Forms | Forms, **Forms Advanced** (conditional, JSON dynamic, repeatable, async validation) |
| Files | File Manager, **Uploads**, **Downloads** |
| Charts / Canvas | **Charts Gallery**, **Canvas Lab** |
| Platform | **API Sim**, **Storage**, **Browser APIs**, Network, Errors |
| Ops | **Admin**, **Search**, Notifications (live), Workflow, Calendar, E‑Commerce |
| Quality | **Accessibility**, **Performance** (10k rows), Settings a11y |
| AI | Streaming, stop, regenerate, copy, like/dislike, history |
| Runner | **Test Runner** (`/test-runner`) — execute Selenium/Playwright Maven suites, logs, reports, framework diagram |
| Practice | Automation Lab + **Playground 100+** (dynamic IDs, waits, shadow, frames, flaky, virtual list, …) |

## Automation Help on every page

Each page includes a collapsible **Automation Help** panel (under the title) with:

- Key concepts (POM, waits, Shadow DOM, frames, file upload, DnD, …)
- Techniques to practice on that screen
- Best practices
- Side-by-side **Selenium / Playwright / Cypress** code samples
- Guidance on which framework fits the scenario best

Content lives in `src/data/automationHelp.js`; UI in `src/components/common/AutomationHelpPanel.jsx` (wired via `PageHeader`).

## Automation identifiers

Helpers live in `src/utils/automation.js`. Interactive controls expose stable, unique attributes so scripts can locate them reliably.

| Attribute | When set |
|-----------|----------|
| `id` | Always (same value as `data-testid`) |
| `data-testid` | Always |
| `name` | Buttons, fields, selects, checkboxes / radios / switches |
| `aria-label` | Icon buttons, nav links, and other icon-only / ambiguous controls |

**Pattern:** `{module}-{element}[-qualifier]` (kebab-case)

| Helper | Use for |
|--------|---------|
| `aid(id)` | Containers, labels, tables, static regions |
| `btn(id, ariaLabel?)` | Buttons / clickable actions |
| `iconBtn(id, ariaLabel)` | Icon-only buttons (`aria-label` required) |
| `field(id, name?)` | TextField (wrapper + native input) |
| `select(id, name?, aria?)` | Select / dropdown |
| `option(id)` / `optId(selectId, value)` | `MenuItem` options under a select |
| `control(id, name?, aria?)` | Checkbox, Radio, Switch |
| `link(id, aria?)` | Links / anchors |
| `input(id, name?)` | Native / file inputs |
| `dyn(base, ...parts)` | Dynamic row / action ids |

**Examples**

| Locator | Element |
|---------|---------|
| `#login-email` / `[data-testid="login-email"]` | Login email |
| `#nav-link-dashboard` | Sidebar Modules → Dashboard |
| `#nav-modules-toggle` | Modules section collapse |
| `#users-btn-add` | Add User |
| `#users-filter-role-option-admin` | Role filter → Admin |
| `#header-btn-theme` | Theme toggle |
| `#payment-card` | Checkout credit-card radio |
| `#pg-btn-delayed-appear` | Playground delayed button |

## Highest-value practice page

Open **Playground 100+** (`/playground`) — isolated tabs for:

- Dynamic IDs / random classes / changing text
- Delayed appear / clickability / AJAX / stale / overlap
- Nested shadow DOM, iframe-in-modal, nested frames
- SVG + canvas signature
- Hover / right-click / double-click / keyboard
- Alerts, toasts, new tab/window, print
- Infinite scroll + virtualized 10k list
- Offline / slow API / flaky / random toast-alert
- Captcha/OTP dummy, a11y & viewport chips

## Stack

React 19 · Vite · MUI · React Router · Redux Toolkit · React Hook Form · TanStack Table · AG Grid · Recharts · React DnD · FullCalendar · React Quill · notistack

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | Oxlint |
