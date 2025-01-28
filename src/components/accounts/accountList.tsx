import { useDispatch, useSelector } from "react-redux";
import {
  selectAccountsLoaded,
  selectSortedAccounts,
  selectSelectedAccount,
} from "../../features/accounts/select";
import {
  loadActivities,
} from "../../features/activities/actions";
import { useEffect, useState, useMemo } from "react";
import { AppDispatch } from "../../store";
import { ActionIcon, Button, Divider, Group, LoadingOverlay, Modal, Select, Stack, Switch, Text, TextInput } from "@mantine/core";
import { setSelectedAccount } from "../../features/accounts/slice";
import { loadGraphData } from "../../features/graph/actions";
import { AccountListProps } from "./types";
import { selectStartDate } from "../../features/activities/select";
import { selectEndDate } from "../../features/activities/select";
import { selectGraphEndDate } from "../../features/graph/select";
import { IconEye, IconEyeOff, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { addAccount, editAccounts } from "../../features/accounts/actions";
import { shallowEqual } from "react-redux";
import { Account } from "../../types/types";
import { CheckboxIcon } from "../helpers/checkboxIcon";

const types = ["Checking", "Savings", "Credit", "Loan", "Investment", "Other"];

const compareTypes = (a: string, b: string) => {
  return types.indexOf(a) - types.indexOf(b);
}

export default function AccountList({ close }: AccountListProps) {
  const [addingAccount, { open: openAddingAccount, close: closeAddingAccount }] = useDisclosure(false);
  const [editingAccounts, { open: openEditingAccounts, close: closeEditingAccounts }] = useDisclosure(false);

  const accounts = useSelector(selectSortedAccounts, shallowEqual);
  const loaded = useSelector(selectAccountsLoaded, shallowEqual);
  const selectedAccount = useSelector(selectSelectedAccount, shallowEqual);
  const startDate = useSelector(selectStartDate, (a, b) => a === b);
  const endDate = useSelector(selectEndDate, (a, b) => a === b);
  const graphEndDate = useSelector(selectGraphEndDate, (a, b) => a === b);

  const startDateObj = useMemo(() => new Date(startDate), [startDate]);
  const endDateObj = useMemo(() => new Date(endDate), [endDate]);
  const graphEndDateObj = useMemo(() => new Date(graphEndDate), [graphEndDate]);

  const [addingAccountType, setAddingAccountType] = useState<string | null>(null);
  const [editingAccountName, setEditingAccountName] = useState<string>("");

  const [editingAccountsList, setEditingAccountsList] = useState<Account[]>([]);

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
      dispatch(loadActivities(selectedAccount, startDateObj, endDateObj));
      dispatch(loadGraphData(selectedAccount, graphEndDateObj));
    }
  }, [selectedAccount, startDateObj, endDateObj, graphEndDateObj]);

  useEffect(() => {
    if (loaded && accounts.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(accounts[0]));
    }
  }, [loaded, accounts, selectedAccount, startDate, endDate]);

  const accountsWithCategories = accounts.reduce((acc, account) => {
    if (account.hidden) return acc;
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  const resetEditingAccounts = () => {
    setEditingAccountsList(accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      hidden: account.hidden,
      balance: account.balance,
    })));
  }

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
            <Group justify="space-between">
              <Text size="xs" fw={500} c="dimmed">{type}</Text>
              <ActionIcon h={18} w={27} mih={0} miw={0} onClick={() => {
                setAddingAccountType(type);
                setEditingAccountName("");
                openAddingAccount();
              }}>
                <IconPlus size="12px" />
              </ActionIcon>
            </Group>
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
        <Divider />
        <Button onClick={() => {
          openEditingAccounts();
          resetEditingAccounts();
        }}>Edit Accounts</Button>
        <Modal
          opened={addingAccount}
          onClose={closeAddingAccount}
          title="Add Account"
        >
          <Stack>
            <TextInput placeholder="Name" value={editingAccountName} onChange={(e) => setEditingAccountName(e.target.value)} />
            <Button disabled={!addingAccountType || !editingAccountName || editingAccountName === ""} onClick={() => {
              if (addingAccountType && editingAccountName !== "") {
                dispatch(addAccount({ type: addingAccountType, name: editingAccountName, balance: 0, hidden: false, id: "" }));
              }
              closeAddingAccount();
            }}>Add</Button>
          </Stack>
        </Modal>
        <Modal
          opened={editingAccounts}
          onClose={closeEditingAccounts}
          title="Edit Accounts"
        >
          <Stack w="100%">
            {editingAccountsList.sort((a, b) => compareTypes(a.type, b.type) || a.name.localeCompare(b.name)).map((account) => (
              <Group key={account.id} w="100%">
                <TextInput style={{ flex: 7 }} placeholder="Name" value={account.name} onChange={(e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, name: e.target.value } : a))} />
                <Select style={{ flex: 4 }} placeholder="Type" data={types.map((type) => ({ value: type, label: type }))} value={account.type} onChange={(e) => e && setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, type: e } : a))} />
                <CheckboxIcon
                  checked={account.hidden}
                  onChange={(checked) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, hidden: checked } : a))}
                  checkedIcon={<IconEyeOff />}
                  uncheckedIcon={<IconEye />}
                />
              </Group>
            ))}
            <Button onClick={() => {
              dispatch(editAccounts(editingAccountsList));
              closeEditingAccounts();
              resetEditingAccounts();
            }}>Save</Button>
          </Stack>
        </Modal>
      </Stack>
    </>
  );
}
