import React from 'react';
import './App.css';
import { ActionIcon, AppShell, Box, Burger, Button, Group, VisuallyHidden } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { IconCalendar, IconChartPie, IconTable, IconGraph, IconTransfer, IconChartAreaFilled, IconChartLine, IconArrowsSplit2, IconHeartbeat, IconTargetArrow } from '@tabler/icons-react';
import { loadAccounts } from './features/accounts/actions';
import AccountList from './components/accounts/accountList';
import Account from './components/account/account';
import { PageComponentType, SidebarComponentType } from './types/types';
import { loadCategories } from './features/categories/actions';
import Simulations from './components/simulations/simulations';
import Variables from './components/variables/variables';
import { loadSimulations } from './features/simulations/actions';
import { loadNames } from './features/activities/actions';
import Categories from './components/categories/categories';
import CategoriesAccountSelector from './components/categories/categoriesAccountSelector';
import Calendar from './components/calendar/billCalendar';
import CalendarAccountSelector from './components/calendar/calendarAccountSelector';
import { loadCalendar } from './features/calendar/actions';
import Flow from './components/flow/flow';
import FlowAccountSelector from './components/flow/flowAccountSelector';
import { loadFlow } from './features/flow/actions';
import GraphView from './components/graphView/graphView';
import GraphViewAccountSelector from './components/graphView/graphViewAccountSelector';
import MonteCarlo from './components/monteCarlo/monteCarlo';
import MonteCarloSimulationSelector from './components/monteCarlo/monteCarloSimulationSelector';
import { Login } from './components/login/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useToken } from './hooks/useToken';
import { MoneyMovement } from './components/moneyMovement/moneyMovement';
import { loadMoneyMovementChart } from './features/moneyMovement/actions';
import Healthcare from './components/healthcare/healthcare';
import HealthcareSidebar from './components/healthcare/healthcareSidebar';
import { loadHealthcareConfigs } from './features/healthcare/actions';
import SpendingTracker from './components/spendingTracker/spendingTracker';
import { loadSpendingTrackerCategories } from './features/spendingTracker/actions';
import { ErrorNotifications } from './components/helpers/errorNotifications';

type Page = {
  title: string;
  component: React.ComponentType;
  sidebar: React.ComponentType<{ close: () => void }>;
  icon: React.ComponentType;
  hidden?: boolean;
};

const pages: Record<string, Page> = {
  accounts: {
    title: 'Accounts',
    component: Account,
    sidebar: AccountList,
    icon: IconTable,
  },
  simulations: {
    title: 'Simulation',
    component: Variables,
    sidebar: Simulations,
    icon: IconGraph,
  },
  calendar: {
    title: 'Calendar',
    component: Calendar,
    sidebar: CalendarAccountSelector,
    icon: IconCalendar,
  },
  categories: {
    title: 'Categories',
    component: Categories,
    sidebar: CategoriesAccountSelector,
    icon: IconChartPie,
  },
  healthcare: {
    title: 'Healthcare',
    component: Healthcare,
    sidebar: HealthcareSidebar,
    icon: IconHeartbeat,
  },
  flow: {
    title: 'Flow',
    component: Flow,
    sidebar: FlowAccountSelector,
    icon: IconTransfer,
    hidden: true,
  },
  graphView: {
    title: 'Graph View',
    component: GraphView,
    sidebar: GraphViewAccountSelector,
    icon: IconChartLine,
  },
  monteCarlo: {
    title: 'Monte Carlo',
    component: MonteCarlo,
    sidebar: MonteCarloSimulationSelector,
    icon: IconArrowsSplit2,
    hidden: true,
  },
  moneyMovement: {
    title: 'Money Movement',
    component: MoneyMovement,
    sidebar: () => null,
    icon: IconChartAreaFilled,
    hidden: true,
  },
  spendingTracker: {
    title: 'Spending Tracker',
    component: SpendingTracker,
    sidebar: () => null,
    icon: IconTargetArrow,
  },
};

function App() {
  const { token, setToken, validateToken } = useToken();

  useEffect(() => {
    if (token && token !== 'INVALID') {
      validateToken();
    }
  }, [token, validateToken]);

  if (!token || token === 'INVALID') {
    return <Login setToken={setToken} invalid={token === 'INVALID'} />;
  }

  return (
    <BrowserRouter>
      <ErrorNotifications />
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppContent() {
  const [opened, { toggle, close }] = useDisclosure();
  const [page, setPage] = useState<string>(Object.keys(pages)[0]);
  const dispatch = useDispatch<AppDispatch>();
  const mainContentRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.title = `${pages[page].title} - Bills`;
  }, [page]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainContentRef.current?.focus();
  }, [page]);

  useEffect(() => {
    dispatch(loadAccounts());
    dispatch(loadCategories());
    dispatch(loadSimulations());
    dispatch(loadCalendar());
    dispatch(loadNames());
    dispatch(loadFlow());
    dispatch(loadMoneyMovementChart());
    dispatch(loadHealthcareConfigs());
    dispatch(loadSpendingTrackerCategories());
  }, []);

  const PageComponent = pages[page as keyof typeof pages].component as PageComponentType;

  const SidebarComponent = pages[page as keyof typeof pages].sidebar as SidebarComponentType;

  return (
    <>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: 9999,
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'static';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
        }}
      >
        Skip to main content
      </a>
      <AppShell
        header={{ height: 50 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        styles={{
          main: { height: 'calc(100vh - 50px)' },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group p="xs" w="100%">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Toggle sidebar navigation" />
            <nav aria-label="Main navigation">
              <Group justify="space-between" style={{ flex: 1 }}>
                {Object.entries(pages).map(([key, { title, icon, hidden }]) => {
                  if (hidden) return null;
                  const Icon = icon as React.ComponentType;
                  return (
                    <Box key={key}>
                      <Button
                        visibleFrom="sm"
                        onClick={() => {
                          setPage(key);
                          if (opened) {
                            toggle();
                          }
                        }}
                        aria-current={page === key ? 'page' : undefined}
                      >
                        {title}
                      </Button>
                      <ActionIcon
                        onClick={() => {
                          setPage(key);
                          if (opened) {
                            toggle();
                          }
                        }}
                        hiddenFrom="sm"
                        disabled={page === key}
                        aria-label={title}
                        aria-current={page === key ? 'page' : undefined}
                      >
                        <Icon />
                      </ActionIcon>
                    </Box>
                  );
                })}
              </Group>
            </nav>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" style={{ overflow: 'auto' }}>
          <nav aria-label="Sidebar navigation">
            <SidebarComponent close={close} />
          </nav>
        </AppShell.Navbar>

        <AppShell.Main id="main-content" ref={mainContentRef} tabIndex={-1}>
          <VisuallyHidden><h1>{pages[page].title}</h1></VisuallyHidden>
          <PageComponent />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
