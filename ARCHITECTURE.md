# Bills-Client Architecture

## Table of Contents

- [System Overview](#system-overview)
- [Application Structure](#application-structure)
- [Component Hierarchy](#component-hierarchy)
- [Redux Architecture](#redux-architecture)
- [API Integration](#api-integration)
- [Data Flow Patterns](#data-flow-patterns)
- [Charting Strategy](#charting-strategy)
- [Authentication](#authentication)
- [Hooks](#hooks)
- [Responsive Design](#responsive-design)

---

## System Overview

Bills-Client is a React 18 single-page application built with TypeScript and Vite. It serves as the frontend for a financial planning and bill management system, providing interactive visualizations, account projections, and budgeting tools.

### Technology Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| Framework          | React 18                                             |
| Language           | TypeScript                                           |
| Build Tool         | Vite                                                 |
| State Management   | Redux Toolkit (12 slices)                            |
| UI Library         | Mantine (dark theme)                                 |
| Charting           | Chart.js, D3/Sankey, react-big-calendar, Recharts    |
| Date Handling      | dayjs                                                |
| HTTP               | fetch (via centralized wrapper)                      |

---

## Application Structure

### Entry Point

`main.tsx` bootstraps the application by wrapping the root component in a Redux `Provider` and Mantine's theme provider (configured with a dark theme).

### App.tsx: Top-Level Routing and Layout

`App.tsx` serves as the application shell. It performs two key functions:

1. **Authentication guard** -- Renders the `Login` page if no valid JWT exists, otherwise renders `AppContent`.
2. **Layout via Mantine AppShell** -- Provides a consistent layout with header, navbar (sidebar), and main content area.

```
App.tsx
  |
  +-- [No valid token] --> Login
  |
  +-- [Valid token] --> AppContent
                          |
                          +-- AppShell
                                +-- Header (navigation, burger menu)
                                +-- Navbar (page-specific sidebar)
                                +-- Main (page-specific content)
```

### Page Registration

Ten pages are registered in `App.tsx` as a configuration map. Each page entry defines:

| Property    | Type        | Description                              |
| ----------- | ----------- | ---------------------------------------- |
| `title`     | `string`    | Display name in navigation               |
| `component` | `Component` | Main content area component              |
| `sidebar`   | `Component` | Sidebar component (receives close prop)  |
| `icon`      | `Component` | Navigation icon                          |
| `hidden`    | `boolean?`  | If true, page is not shown in navigation |

### Data Initialization

When `AppContent` mounts, it dispatches Redux thunks to load all required data from the backend. This ensures the application state is fully populated before the user interacts with any page.

---

## Component Hierarchy

### Overall Layout

```
<ReduxProvider>
  <MantineProvider theme={darkTheme}>
    <App>
      +-- <Login />                          (unauthenticated)
      +-- <AppContent>                       (authenticated)
            +-- <AppShell>
                  +-- <AppShell.Header>
                  |     +-- Page navigation tabs/links
                  |     +-- Burger menu (mobile)
                  +-- <AppShell.Navbar>
                  |     +-- <ActivePage.sidebar close={fn} />
                  +-- <AppShell.Main>
                        +-- <ActivePage.component />
    </App>
  </MantineProvider>
</ReduxProvider>
```

### Page Components

Each page follows the **Page + Sidebar** pattern. The main component renders in the content area; the sidebar component renders in the navbar and receives a `close` callback for dismissing the mobile drawer.

| Page               | Main Component Purpose                              | Sidebar Purpose                        |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| **Account**        | Activities table + balance projection graph         | Account selector                       |
| **Calendar**       | Month view (react-big-calendar) with bills as events| Date range and account filters         |
| **Categories**     | Doughnut chart + transaction table, drill-down      | Category/date/account filters          |
| **GraphView**      | Multi-account/simulation line chart projections     | Account/simulation selection           |
| **Healthcare**     | Config list, deductible progress, expense table     | Person/config management               |
| **SpendingTracker**| Budget periods chart, category config editor        | Date range modes, category CRUD        |
| **Flow**           | D3 Sankey diagram of money movement                 | Flow configuration                     |
| **Simulations**    | (Sidebar-only) Variable editor table                | Variable editor                        |
| **MonteCarlo**     | Statistical simulation results and charts           | Simulation controls                    |
| **MoneyMovement**  | Money movement chart visualization                  | Filters and controls                   |

### Shared / Helper Components

| Component              | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `EditableDateInput`    | Inline-editable date field                                     |
| `CreatableSelect`      | Dropdown supporting `group.item` notation for categories       |
| `FlagSelect`           | Multi-select with flag/toggle semantics                        |
| `CalculatorEditor`     | Expression parser for entering calculated values               |
| `ConditionalTooltip`   | Tooltip that only renders when a condition is met              |

---

## Redux Architecture

The application uses Redux Toolkit with 12 feature slices, each following a consistent file structure:

```
src/features/<feature>/
  +-- slice.ts      # State shape, reducers, initial state
  +-- select.ts     # Memoized selectors
  +-- actions.ts    # Async thunks (API calls)
  +-- api.ts        # HTTP request functions
```

### State Tree

```
store
  +-- accounts
  +-- activities
  +-- graph
  +-- categories
  +-- calendar
  +-- simulations
  +-- flow
  +-- graphView
  +-- monteCarlo
  +-- moneyMovement
  +-- healthcare
  +-- spendingTracker
```

### Feature Slices in Detail

#### accounts

| Field            | Type        | Description                         |
| ---------------- | ----------- | ----------------------------------- |
| `accounts`       | `Account[]` | All accounts for current simulation |
| `selectedAccount`| `Account`   | Currently selected account          |
| `loaded`         | `boolean`   | Loading state                       |
| `error`          | `string?`   | Error message                       |

**Key selectors:**
- `sortedAccounts` -- Accounts sorted by type, then by name
- `visibleAccounts` -- Filters out hidden accounts

#### activities

| Field              | Type           | Description                              |
| ------------------ | -------------- | ---------------------------------------- |
| `activities`       | `Activity[]`   | Activities for selected account/range    |
| `selectedActivity` | `Activity?`    | Currently selected activity              |
| `selectedBill`     | `Bill?`        | Currently selected bill                  |
| `interests`        | `Interest[]`   | Interest rate data                       |
| `startDate`        | `string`       | Filter start date                        |
| `endDate`          | `string`       | Filter end date                          |
| `names`            | `Map`          | Name-to-category mapping                 |

**Key reducers:**
- `newActivity` -- Creates a default activity object
- `newBill` -- Creates a default bill object
- `duplicateActivity` -- Deep copies all fields of an existing activity

#### graph

| Field      | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| `datasets` | `Dataset[]`| Chart.js-compatible datasets                |
| `labels`   | `string[]` | X-axis labels                               |
| `type`     | `string`   | Chart type (`activity` or `yearly`)         |
| `dateRange`| `object`   | Start/end date for projection               |
| `show`     | `boolean`  | Visibility toggle                           |

#### categories

| Field              | Type       | Description                              |
| ------------------ | ---------- | ---------------------------------------- |
| `categories`       | `object`   | Dictionary of group to items array       |
| `breakdown`        | `object`   | Category to total amount mapping         |
| `selectedCategory` | `object?`  | Drill-down detail for selected category  |
| `dateRange`        | `object`   | Filter date range                        |
| `accountFilter`    | `string?`  | Optional account filter                  |

#### calendar

| Field           | Type              | Description                            |
| --------------- | ----------------- | -------------------------------------- |
| `bills`         | `CalendarBill[]`  | Bills with calculated dates/amounts    |
| `dateRange`     | `object`          | Visible date range                     |
| `accountFilter` | `string?`         | Optional account filter                |

#### simulations

| Field           | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `simulations`   | `Simulation[]`   | All simulations with name/variables     |
| `usedVariables` | `Map`            | Tracks which variables are referenced   |

Each simulation has: `name`, `variables` (key-value pairs), `enabled`, `selected`.

#### flow

| Field   | Type     | Description                              |
| ------- | -------- | ---------------------------------------- |
| `nodes` | `Node[]` | Sankey diagram nodes                     |
| `links` | `Link[]` | Sankey diagram links between nodes       |

#### graphView

| Field             | Type        | Description                                |
| ----------------- | ----------- | ------------------------------------------ |
| `datasets`        | `Dataset[]` | Multi-account/simulation chart data        |
| `combineAccounts` | `boolean`   | Whether to merge accounts into one line    |

**Auto-coloring system:** Cycles through 15 colors and 6 dash patterns to distinguish datasets when plotting multiple accounts or simulations simultaneously.

#### monteCarlo

| Field    | Type        | Description                              |
| -------- | ----------- | ---------------------------------------- |
| `datasets`| `Dataset[]`| Simulation result datasets               |
| `status` | `string`    | Async polling status                     |

Uses async polling to track long-running Monte Carlo simulations on the backend.

#### moneyMovement

| Field     | Type        | Description                             |
| --------- | ----------- | --------------------------------------- |
| `data`    | `ChartData` | Chart-ready money movement data         |
| `loading` | `boolean`   | Loading state                           |
| `error`   | `string?`   | Error message                           |

#### healthcare

| Field    | Type                 | Description                          |
| -------- | -------------------- | ------------------------------------ |
| `configs`| `HealthcareConfig[]` | Healthcare plan configurations       |

Supports full CRUD operations.

**Key selectors:**
- `configsByPerson` -- Groups configurations by person
- `activeConfigs` -- Filters to configs within a date range
- `hsaAccounts` -- Filters to HSA-type accounts

#### spendingTracker

| Field        | Type         | Description                              |
| ------------ | ------------ | ---------------------------------------- |
| `categories` | `Category[]` | Spending categories with CRUD            |
| `chartData`  | `ChartData`  | Budget visualization data                |
| `dateMode`   | `string`     | `smart` or `custom`                      |
| `dateRange`  | `object`     | Date range (smart: weeks/months/years)   |

**Smart date ranges:** Automatically calculates period boundaries based on unit (weeks, months, years).

---

## API Integration

### Centralized HTTP Layer

All API communication flows through a centralized module in `utils/api.tsx`:

```
+------------------+       +------------------+       +------------------+
|  Redux Thunk     | ----> |  api.get/post/   | ----> |  fetchWithAuth   |
|  (actions.ts)    |       |  put/delete      |       |  (adds JWT +     |
|                  |       |  (appends sim)   |       |   headers)       |
+------------------+       +------------------+       +------------------+
                                                             |
                                                             v
                                                      fetch("/api/...")
                                                             |
                                                             v
                                                      Vite proxy
                                                             |
                                                             v
                                                      Backend server
```

### Key Behaviors

1. **Authentication:** `fetchWithAuth` wraps every `fetch` call, injecting the JWT token from `localStorage` into request headers.

2. **Simulation scoping:** `api.get`, `api.post`, `api.put`, and `api.delete` automatically append `?simulation=<selectedSimulation>` to every request URL. All data is scoped to the currently selected simulation.

3. **Proxy configuration:** Vite's dev server proxies all `/api/*` requests to the backend server port (configured via environment variables in `vite.config.ts`).

4. **Error handling:** 401 responses trigger automatic token clearing and redirect to the login page.

---

## Data Flow Patterns

### Standard Load Pattern

```
User navigates to page
        |
        v
Component mounts
        |
        v
dispatch(loadData())          <-- Redux async thunk
        |
        v
api.get("/api/endpoint")      <-- Adds JWT + simulation param
        |
        v
Backend processes request
        |
        v
Reducer updates state
        |
        v
Selectors derive data         <-- Memoized (e.g., sortedAccounts)
        |
        v
Component re-renders
```

### Save Cascade Pattern

Saving an entity triggers a cascade of reloads to keep dependent data in sync:

```
User saves an activity
        |
        v
dispatch(saveActivity(data))
        |
        +---> reload activities
        +---> reload graph
        +---> reload names
        +---> reload categories
        +---> reload calendar
        +---> reload accounts
        +---> reload flow
```

This ensures that calculated/derived views (projections, charts, calendars) reflect the latest data without requiring a full page reload.

### Simulation Scoping

All API calls are scoped to the currently selected simulation. Switching simulations triggers a full data reload, as every piece of data (accounts, bills, activities, projections) is simulation-specific.

```
User selects Simulation B
        |
        v
dispatch(selectSimulation("B"))
        |
        v
All feature thunks re-dispatch with simulation="B"
        |
        v
Entire Redux state refreshes with Simulation B data
```

---

## Charting Strategy

The application uses four charting libraries, each chosen for a specific visualization need:

| Library              | Used For                        | Pages                    |
| -------------------- | ------------------------------- | ------------------------ |
| Chart.js (react-chartjs-2) | Line charts (projections), doughnut charts | Account, Categories, GraphView |
| D3 + d3-sankey       | Sankey flow diagrams            | Flow, MoneyMovement      |
| react-big-calendar   | Month/week calendar views       | Calendar                 |
| Mantine Charts (Recharts) | Bar/area charts            | Healthcare, SpendingTracker |

### Chart.js Usage

- **Line charts:** Balance projections over time. Used in the Account page for single-account projections and in GraphView for multi-account/simulation overlays.
- **Doughnut charts:** Category breakdowns showing proportional spending by category.

### D3 Sankey

- Renders directed flow diagrams showing how money moves between sources (income) and destinations (expenses, savings).
- Nodes represent accounts or categories; links represent money flow with proportional width.

### react-big-calendar

- Monthly calendar view where recurring bills appear as color-coded events.
- Uses dayjs as its localizer for date calculations.
- Events are colored by bill type for quick visual scanning.

### Mantine Charts

- Built on Recharts under the hood, used for healthcare deductible progress and spending tracker budget period visualizations.
- Integrates naturally with the Mantine theme system.

---

## Authentication

### JWT Lifecycle

```
App startup
    |
    v
Check localStorage for token
    |
    +-- [No token] --> Render Login page
    |
    +-- [Has token] --> Validate token (check expiration)
            |
            +-- [Invalid/expired] --> Clear token, render Login
            |
            +-- [Valid] --> Render AppContent, initialize data
```

### Token Handling

- **Storage:** JWT stored in `localStorage` under a known key.
- **Injection:** Every API call includes the token via the `fetchWithAuth` wrapper.
- **Validation:** Token is checked for validity on application startup (expiration check).
- **Clearing:** Token is removed from `localStorage` on:
  - Explicit logout
  - 401 response from any API call
  - Failed validation on startup

### Login Flow

1. User submits credentials on the Login page.
2. Credentials are sent to `/api/auth/login` (the only unauthenticated endpoint).
3. On success, the JWT is stored in `localStorage`.
4. `App.tsx` re-renders, detects valid token, and renders `AppContent`.

---

## Hooks

### useToken

Manages the full JWT lifecycle:

| Method     | Description                                      |
| ---------- | ------------------------------------------------ |
| `get`      | Retrieves the current token from localStorage    |
| `set`      | Stores a new token in localStorage               |
| `clear`    | Removes the token from localStorage              |
| `validate` | Checks token existence and expiration            |

### useElementAspectRatio

Uses a `ResizeObserver` to track the aspect ratio of a DOM element. Returns a ratio value that components use to switch between wide and tall layouts (e.g., switching from a side-by-side layout to a stacked layout when the container becomes narrow).

---

## Responsive Design

### Mantine AppShell

The application uses Mantine's `AppShell` component for responsive layout:

- **Desktop:** Sidebar is always visible alongside the main content area.
- **Mobile:** Sidebar collapses into a drawer, toggled by a burger menu in the header.

### Breakpoint Strategy

| Mechanism                | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `visibleFrom` prop       | Show elements only above a breakpoint                |
| `hiddenFrom` prop        | Hide elements above a breakpoint                     |
| `useElementAspectRatio`  | Switch component layout based on container shape     |
| Burger menu              | Replaces persistent navbar on small screens          |

### Layout Adaptation

Components adapt to available space rather than relying solely on viewport breakpoints. The `useElementAspectRatio` hook enables container-query-like behavior, allowing charts and data tables to reorganize based on the actual space they occupy rather than the overall screen size.
