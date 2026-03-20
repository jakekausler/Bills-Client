# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (uses CLIENT_PORT from .env)
- `npm run dev:api` - Start Deno API server with watch mode
- `npm run build` - Build production bundle (TypeScript compile + Vite build)
- `npm run lint` - Run TypeScript compiler check + ESLint
- `npm run lint:fix` - Run TypeScript compiler check + ESLint with auto-fix
- `npm run preview` - Preview production build locally

### Environment Setup
- Copy `.env.sample` to `.env` and configure CLIENT_PORT and SERVER_PORT
- The frontend proxies `/api` requests to the backend server specified in SERVER_PORT

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Mantine 7.15.2 (components, hooks, charts, dates)
- **State Management**: Redux Toolkit with thunks
- **Routing**: React Router DOM v7
- **Charts**: Multiple libraries (Chart.js, Recharts, D3, Mantine Charts)
- **Backend**: Deno-based API server

### Application Structure

This is a financial planning/budgeting application with the following key features:
- **Accounts**: Financial account management with balances, types, and configurations
- **Activities**: Financial transactions and activities with categorization
- **Simulations**: Multiple financial scenarios with variables
- **Calendar**: Bill scheduling and calendar visualization
- **Categories**: Transaction categorization and analysis
- **Flow**: Money flow visualization (Sankey diagrams)
- **Graph View**: Account balance projections over time
- **Monte Carlo**: Statistical financial modeling
- **Money Movement**: Transaction flow analysis

### Code Organization

#### State Management (Redux)
- **Store**: `src/store.ts` - Central Redux store configuration
- **Features**: `src/features/` - Domain-specific Redux slices
  - Each feature has: `actions.ts`, `api.ts`, `select.ts`, `slice.ts`
  - Features: accounts, activities, calendar, categories, flow, graph, graphView, moneyMovement, monteCarlo, simulations

#### Components
- **Pages**: Main application pages mapped in `src/App.tsx`
- **Component Structure**: `src/components/[feature]/` - Feature-specific components
- **Helpers**: `src/components/helpers/` - Reusable UI components
- **Types**: `src/types/types.d.ts` - TypeScript type definitions

#### API Integration
- **API Utilities**: `src/utils/api.tsx` - Authentication and request helpers
- **Authentication**: Token-based auth stored in localStorage
- **Simulation Context**: All API calls automatically include selected simulation parameter

### MC Reporting Framework (#33)

The Monte Carlo results page uses an extensible view registry pattern:

**Architecture:**
- `components/monteCarlo/viewRegistry.ts` — View registration interface (`MCViewProps`, `MCView`)
- `components/monteCarlo/controlsBar.tsx` — Global controls (account selector, real/nominal, deterministic toggle)
- `components/monteCarlo/summaryCards.tsx` — 4 summary stat cards
- `components/monteCarlo/fanChart.tsx` — Fan chart with 4 percentile bands
- `components/monteCarlo/failureHistogram.tsx` — Bar chart of failure year distribution
- `components/monteCarlo/worstCases.tsx` — Bottom 5% simulation trajectories
- `components/monteCarlo/utils.ts` — Shared formatting utilities

**Adding a new view:**
1. Create a component implementing `MCViewProps` interface
2. Call `registerView({ id, title, component, columns: 1|2|3 })` at module scope
3. Import the file (side-effect) in `monteCarlo.tsx`

**Global controls** (in Redux state):
- `reportingAccount` — filters all views to a specific account (null = combined)
- `showReal` — toggles nominal vs inflation-adjusted dollars
- `showDeterministic` — shows/hides deterministic overlay line

**Backend:** Graph endpoint computes percentiles on-demand from raw results. Supports `?account={id}` for per-account data. In-memory cache by simulationId+accountId.

### Key Patterns

#### Page Registration
Pages are registered in `src/App.tsx` with:
```typescript
const pages: Record<string, Page> = {
  pageName: {
    title: 'Display Name',
    component: MainComponent,
    sidebar: SidebarComponent,
    icon: IconComponent,
    hidden?: boolean, // Optional, hides from navigation
  }
}
```

#### Redux Feature Pattern
Each feature follows consistent structure:
- **Slice**: State definition and reducers
- **Actions**: Async thunks for API calls
- **Selectors**: State selection utilities
- **API**: HTTP request functions

#### Component Props
- **Page Components**: Receive no props
- **Sidebar Components**: Receive `{ close: () => void }`
- **Account Selectors**: Most features have dedicated account selector sidebars

### Authentication
- Token-based authentication with localStorage persistence
- Login component renders when no valid token exists
- Token validation on app startup
- All API requests include Authorization header

### Environment Variables
- `CLIENT_PORT`: Frontend development server port
- `SERVER_PORT`: Backend API server port
- Frontend proxies `/api` to backend server

### Important Dependencies
- **Mantine**: Primary UI component library
- **@reduxjs/toolkit**: State management
- **dayjs**: Date manipulation
- **react-big-calendar**: Calendar components
- **d3/d3-sankey**: Flow visualization
- **chart.js + react-chartjs-2**: Charting
- **recharts**: Additional charting library

### Development Notes
- TypeScript strict mode enabled
- ESLint with TypeScript rules
- Vite for fast development and building
- Hot module replacement in development
- Deno backend with file watching