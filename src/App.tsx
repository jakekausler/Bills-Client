import React from 'react';
import './App.css';
import { ActionIcon, AppShell, Box, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { IconCalendar, IconChartPie, IconTable, IconGraph, IconTransfer, IconChartBar, IconChartAreaFilled, IconChartLine, IconArrowsSplit2, IconHeartbeat } from '@tabler/icons-react';
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
  },
  moneyMovement: {
    title: 'Money Movement',
    component: MoneyMovement,
    sidebar: () => null,
    icon: IconChartAreaFilled,
  },
};

function App() {
  const { token, setToken, validateToken } = useToken();

  useEffect(() => {
    if (token && token !== 'INVALID') {
      validateToken();
    }
  }, [token]);

  if (!token || token === 'INVALID') {
    return <Login setToken={setToken} invalid={token === 'INVALID'} />;
  }

  return (
    <BrowserRouter>
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

  useEffect(() => {
    dispatch(loadAccounts());
    dispatch(loadCategories());
    dispatch(loadSimulations());
    dispatch(loadCalendar());
    dispatch(loadNames());
    dispatch(loadFlow());
    dispatch(loadMoneyMovementChart());
    dispatch(loadHealthcareConfigs());
  }, []);

  const PageComponent = pages[page as keyof typeof pages].component as PageComponentType;

  const SidebarComponent = pages[page as keyof typeof pages].sidebar as SidebarComponentType;

  return (
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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
                  >
                    <Icon />
                  </ActionIcon>
                </Box>
              );
            })}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ overflow: 'auto' }}>
        <Box>
          <SidebarComponent close={close} />
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        <PageComponent />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
