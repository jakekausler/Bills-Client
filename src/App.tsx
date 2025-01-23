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
import { AppDispatch } from "./store.ts";
import {
  IconCalendar,
  IconChartPie,
  IconTable,
  IconGraph,
  IconTransfer,
  IconChartBar,
} from "@tabler/icons-react";
import { loadAccounts } from "./features/accounts/actions.ts";
import AccountList from "./components/accounts/accountList.tsx";
import Account from "./components/account/account.tsx";
import { PageComponentType, SidebarComponentType } from "./types/types.ts";
import { loadCategories } from "./features/categories/actions.ts";
import Simulations from "./components/simulations/simulations.tsx";
import Variables from "./components/variables/variables.tsx";
import { loadSimulations } from "./features/simulations/actions.ts";
import { loadNames } from "./features/activities/actions.ts";
import Categories from "./components/categories/categories.tsx";
import CategoriesAccountSelector from "./components/categories/categoriesAccountSelector.tsx";
import Calendar from "./components/calendar/billCalendar.tsx";
import CalendarAccountSelector from "./components/calendar/calendarAccountSelector.tsx";
import { loadCalendar } from "./features/calendar/actions.ts";
import Flow from "./components/flow/flow.tsx";
import FlowAccountSelector from "./components/flow/flowAccountSelector.tsx";
import { loadFlow } from "./features/flow/actions.ts";
import GraphView from "./components/graphView/graphView.tsx";
import GraphViewAccountSelector from "./components/graphView/graphViewAccountSelector.tsx";

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
};

function App() {
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
