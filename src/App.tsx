import React from 'react';
import "./App.css";
import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import {
  IconCalendar,
  IconChartPie,
  IconTable,
  IconGraph,
  IconTransfer,
  IconChartBar,
} from "@tabler/icons-react";
import { loadAccounts } from "./features/accounts/actions";
import AccountList from "./components/accounts/accountList";
import Account from "./components/account/account";
import { PageComponentType, SidebarComponentType } from "./types/types";
import { loadCategories } from "./features/categories/actions";
import Simulations from "./components/simulations/simulations";
import Variables from "./components/variables/variables";
import { loadSimulations } from "./features/simulations/actions";
import { loadNames } from "./features/activities/actions";
import Categories from "./components/categories/categories";
import CategoriesAccountSelector from "./components/categories/categoriesAccountSelector";
import Calendar from "./components/calendar/billCalendar";
import CalendarAccountSelector from "./components/calendar/calendarAccountSelector";
import { loadCalendar } from "./features/calendar/actions";
import Flow from "./components/flow/flow";
import FlowAccountSelector from "./components/flow/flowAccountSelector";
import { loadFlow } from "./features/flow/actions";
import GraphView from "./components/graphView/graphView";
import GraphViewAccountSelector from "./components/graphView/graphViewAccountSelector";
import MonteCarlo from "./components/monteCarlo/monteCarlo";
import MonteCarloAccountSelector from "./components/monteCarlo/monteCarloAccountSelector";
import { Login } from './components/login/login';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useToken } from './hooks/useToken';

const pages = {
  accounts: {
    title: "Accounts",
    component: Account,
    sidebar: AccountList,
    icon: IconTable,
  },
  simulations: {
    title: "Simulation",
    component: Variables,
    sidebar: Simulations,
    icon: IconGraph,
  },
  calendar: {
    title: "Calendar",
    component: Calendar,
    sidebar: CalendarAccountSelector,
    icon: IconCalendar,
  },
  categories: {
    title: "Categories",
    component: Categories,
    sidebar: CategoriesAccountSelector,

    icon: IconChartPie,
  },
  flow: {
    title: "Flow",
    component: Flow,
    sidebar: FlowAccountSelector,
    icon: IconTransfer,
  },
  graphView: {
    title: "Graph View",
    component: GraphView,
    sidebar: GraphViewAccountSelector,
    icon: IconChartBar,
  },
  monteCarlo: {
    title: "Monte Carlo",
    component: MonteCarlo,
    sidebar: MonteCarloAccountSelector,
    icon: IconChartBar,
  },
};

function App() {
  const { token, setToken } = useToken();

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
  }, []);

  const PageComponent = pages[page as keyof typeof pages]
    .component as PageComponentType;

  const SidebarComponent = pages[page as keyof typeof pages]
    .sidebar as SidebarComponentType;

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      styles={{
        main: { height: "calc(100vh - 50px)" },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group p="xs" w="100%">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            {Object.entries(pages).map(([key, { title, icon }]) => {
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

      <AppShell.Navbar p="md">
        <SidebarComponent close={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <PageComponent />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
