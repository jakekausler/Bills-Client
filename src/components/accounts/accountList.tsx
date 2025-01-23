import { useDispatch, useSelector } from "react-redux";
import {
  selectAccountsLoaded,
  selectVisibleAccounts,
  selectSelectedAccount,
} from "../../features/accounts/select";
import {
  loadActivities,
} from "../../features/activities/actions";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../store";
import { Button, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { setSelectedAccount } from "../../features/accounts/slice";
import { loadGraphData } from "../../features/graph/actions";
import { AccountListProps } from "./types";
import { selectStartDate } from "../../features/activities/select";
import { selectEndDate } from "../../features/activities/select";
import { selectGraphEndDate } from "../../features/graph/select";

export default function AccountList({ close }: AccountListProps) {
  const accounts = useSelector(selectVisibleAccounts);
  const loaded = useSelector(selectAccountsLoaded);
  const selectedAccount = useSelector(selectSelectedAccount);
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const graphEndDate = new Date(useSelector(selectGraphEndDate));

  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !loaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loaded]);

  useEffect(() => {
    if (selectedAccount) {
      dispatch(loadActivities(selectedAccount, startDate, endDate));
      dispatch(loadGraphData(selectedAccount, graphEndDate));
    }
  }, [selectedAccount, startDate, endDate, graphEndDate]);

  useEffect(() => {
    if (loaded && accounts.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(accounts[0]));
    }
  }, [loaded, accounts, selectedAccount, startDate, endDate]);

  const accountsWithCategories = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  return (
    <>
      <Stack h="100%" pos="relative" gap={8}>
        <LoadingOverlay
          visible={showLoading}
          loaderProps={{ color: 'blue.6', size: 'xl' }}
          overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
        />
        {Object.entries(accountsWithCategories).map(([type, accounts]) => (
          <Stack key={type} gap={4}>
            <Text size="xs" fw={500} c="dimmed">{type}</Text>
            {accounts.map((account) => (
              <Button
                disabled={selectedAccount?.id === account.id}
                key={account.id}
                onClick={() => {
                  dispatch(setSelectedAccount(account));
                  close();
                }}
                styles={{
                  label: { width: "100%" },
                }}
                h={32}
              >
                <Group w="100%" justify="space-between">
                  <Text size="xs">{account.name}</Text>
                  <Text size="xs" c={account.balance < 0 ? "red" : "green"}>
                    {`$ ${account.balance.toFixed(2)}`}
                  </Text>
                </Group>
              </Button>
            ))}
          </Stack>
        ))}
      </Stack>
    </>
  );
}
