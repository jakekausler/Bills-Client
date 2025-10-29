import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountsLoaded, selectSortedAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { loadActivities } from '../../features/activities/actions';
import { useEffect, useState, useMemo } from 'react';
import { AppDispatch } from '../../store';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { setSelectedAccount } from '../../features/accounts/slice';
import { loadGraphData } from '../../features/graph/actions';
import { AccountListProps } from './types';
import { selectStartDate } from '../../features/activities/select';
import { selectEndDate } from '../../features/activities/select';
import { selectGraphStartDate, selectGraphEndDate } from '../../features/graph/select';
import { IconEye, IconEyeOff, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { addAccount, editAccounts } from '../../features/accounts/actions';
import { shallowEqual } from 'react-redux';
import { Account } from '../../types/types';
import { CheckboxIcon } from '../helpers/checkboxIcon';
import { DateInput } from '@mantine/dates';
import { toDateString } from '../../utils/date';

const types = ['Checking', 'Savings', 'Credit', 'Loan', 'Investment', 'HSA', 'Other'];

const compareTypes = (a: string, b: string) => {
  return types.indexOf(a) - types.indexOf(b);
};

export default function AccountList({ close }: AccountListProps) {
  const [addingAccount, { open: openAddingAccount, close: closeAddingAccount }] = useDisclosure(false);
  const [editingAccounts, { open: openEditingAccounts, close: closeEditingAccounts }] = useDisclosure(false);

  const accounts = useSelector(selectSortedAccounts, shallowEqual);
  const loaded = useSelector(selectAccountsLoaded, shallowEqual);
  const selectedAccount = useSelector(selectSelectedAccount, shallowEqual);
  const startDate = useSelector(selectStartDate, (a, b) => a === b);
  const endDate = useSelector(selectEndDate, (a, b) => a === b);
  const graphStartDate = useSelector(selectGraphStartDate, (a, b) => a === b);
  const graphEndDate = useSelector(selectGraphEndDate, (a, b) => a === b);

  const startDateObj = useMemo(() => new Date(startDate), [startDate]);
  const endDateObj = useMemo(() => new Date(endDate), [endDate]);
  const graphStartDateObj = useMemo(() => new Date(graphStartDate), [graphStartDate]);
  const graphEndDateObj = useMemo(() => new Date(graphEndDate), [graphEndDate]);

  const [addingAccountType, setAddingAccountType] = useState<string | null>(null);
  const [editingAccountName, setEditingAccountName] = useState<string>('');

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
      dispatch(loadGraphData(selectedAccount, graphStartDateObj, graphEndDateObj));
    }
  }, [selectedAccount, startDateObj, endDateObj, graphStartDateObj, graphEndDateObj]);

  useEffect(() => {
    if (loaded && accounts.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(accounts[0]));
    }
  }, [loaded, accounts, selectedAccount, startDate, endDate]);

  const accountsWithCategories = accounts.reduce(
    (acc, account) => {
      if (account.hidden) return acc;
      if (!acc[account.type]) {
        acc[account.type] = [];
      }
      acc[account.type].push(account);
      return acc;
    },
    {} as Record<string, typeof accounts>,
  );

  const resetEditingAccounts = () => {
    setEditingAccountsList(
      accounts.map((account) => ({
        id: account.id,
        name: account.name,
        type: account.type,
        hidden: account.hidden,
        balance: account.balance,
        pullPriority: account.pullPriority,
        interestTaxRate: account.interestTaxRate,
        withdrawalTaxRate: account.withdrawalTaxRate,
        earlyWithdrawlPenalty: account.earlyWithdrawlPenalty,
        earlyWithdrawlDate: account.earlyWithdrawlDate,
        interestPayAccount: account.interestPayAccount,
        usesRMD: account.usesRMD,
        accountOwnerDOB: account.accountOwnerDOB,
        rmdAccount: account.rmdAccount,
        minimumBalance: account.minimumBalance,
        minimumPullAmount: account.minimumPullAmount,
        performsPulls: account.performsPulls,
        performsPushes: account.performsPushes,
        pushStart: account.pushStart,
        pushEnd: account.pushEnd,
        pushAccount: account.pushAccount,
      })),
    );
  };

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
              <Text size="xs" fw={500} c="dimmed">
                {type}
              </Text>
              <ActionIcon
                h={18}
                w={27}
                mih={0}
                miw={0}
                onClick={() => {
                  setAddingAccountType(type);
                  setEditingAccountName('');
                  openAddingAccount();
                }}
              >
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
                  label: { width: '100%' },
                }}
                h={32}
              >
                <Group w="100%" justify="space-between">
                  <Text size="xs">{account.name}</Text>
                  <Text size="xs" c={account.balance < 0 ? 'red' : 'green'}>
                    {`$ ${account.balance.toFixed(2)}`}
                  </Text>
                </Group>
              </Button>
            ))}
          </Stack>
        ))}
        <Divider />
        <Button
          onClick={() => {
            openEditingAccounts();
            resetEditingAccounts();
          }}
        >
          Edit Accounts
        </Button>
        <Modal opened={addingAccount} onClose={closeAddingAccount} title="Add Account">
          <Stack>
            <TextInput
              placeholder="Name"
              value={editingAccountName}
              onChange={(e) => setEditingAccountName(e.target.value)}
            />
            <Button
              disabled={!addingAccountType || !editingAccountName || editingAccountName === ''}
              onClick={() => {
                if (addingAccountType && editingAccountName !== '') {
                  dispatch(
                    addAccount({
                      type: addingAccountType,
                      name: editingAccountName,
                      balance: 0,
                      hidden: false,
                      id: '',
                      pullPriority: -1,
                      interestTaxRate: 0,
                      withdrawalTaxRate: 0,
                      earlyWithdrawlPenalty: 0,
                      earlyWithdrawlDate: null,
                      interestPayAccount: null,
                      usesRMD: false,
                      accountOwnerDOB: null,
                      rmdAccount: null,
                      minimumBalance: null,
                      minimumPullAmount: null,
                      performsPulls: false,
                      performsPushes: false,
                      pushStart: null,
                      pushEnd: null,
                      pushAccount: null,
                    }),
                  );
                }
                closeAddingAccount();
              }}
            >
              Add
            </Button>
          </Stack>
        </Modal>
        <Modal opened={editingAccounts} onClose={closeEditingAccounts} title="Edit Accounts" size="xl">
          <Stack>
            <Box h="60vh" style={{ overflowY: 'auto', overflowX: 'auto' }}>
              <Table miw={500} style={{ tableLayout: 'fixed' }}>
                <Table.Thead bg="dark.7" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <Table.Tr>
                    <Table.Th ta="center" w={60}>
                      Visible
                    </Table.Th>
                    <Table.Th ta="center" w={200}>
                      Name
                    </Table.Th>
                    <Table.Th ta="center" w={150}>
                      Type
                    </Table.Th>
                    <Table.Th ta="center" w={80}>
                      Pull Priority
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Withdrawal Tax Rate
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Early Withdrawl Penalty
                    </Table.Th>
                    <Table.Th ta="center" w={120}>
                      Early Withdrawl Date
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Interest Tax Rate
                    </Table.Th>
                    <Table.Th ta="center" w={200}>
                      Interest Pay Account
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Uses RMD
                    </Table.Th>
                    <Table.Th ta="center" w={200}>
                      RMD Account
                    </Table.Th>
                    <Table.Th ta="center" w={120}>
                      Account Owner DOB
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Minimum Balance
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Minimum Pull Amount
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Perform Pulls
                    </Table.Th>
                    <Table.Th ta="center" w={100}>
                      Perform Pushes
                    </Table.Th>
                    <Table.Th ta="center" w={120}>
                      Push Start
                    </Table.Th>
                    <Table.Th ta="center" w={120}>
                      Push End
                    </Table.Th>
                    <Table.Th ta="center" w={200}>
                      Push Account
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {editingAccountsList
                    .sort((a, b) => compareTypes(a.type, b.type) || a.name.localeCompare(b.name))
                    .map((account) => {
                      return (
                        <Table.Tr key={account.id}>
                          <Table.Td>
                            <CheckboxIcon
                              checked={account.hidden}
                              onChange={(checked) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) => (a.id === account.id ? { ...a, hidden: checked } : a)),
                                )
                              }
                              checkedIcon={<IconEyeOff />}
                              uncheckedIcon={<IconEye />}
                            />
                          </Table.Td>
                          <Table.Td>
                            <TextInput
                              value={account.name}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, name: e.target.value } : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              data={types.map((type) => ({ value: type, label: type }))}
                              value={account.type}
                              onChange={(e) =>
                                e &&
                                setEditingAccountsList(
                                  editingAccountsList.map((a) => (a.id === account.id ? { ...a, type: e } : a)),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Savings' || account.type === 'Investment')}
                              value={account.pullPriority || -1}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, pullPriority: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Investment')}
                              value={account.withdrawalTaxRate || 0}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, withdrawalTaxRate: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Investment')}
                              value={account.earlyWithdrawlPenalty || 0}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, earlyWithdrawlPenalty: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              disabled={!(account.type === 'Investment')}
                              value={
                                account.earlyWithdrawlDate
                                  ? new Date(`${account.earlyWithdrawlDate}T00:00:00`)
                                  : undefined
                              }
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, earlyWithdrawlDate: e ? toDateString(e) : null } : a,
                                  ),
                                )
                              }
                              valueFormat="MM/DD/YYYY"
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Savings')}
                              value={account.interestTaxRate || 0}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, interestTaxRate: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              disabled={!(account.type === 'Savings')}
                              data={accounts.map((a) => ({ value: a.name, label: a.name }))}
                              value={account.interestPayAccount || ''}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, interestPayAccount: e } : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <Switch
                              disabled={!(account.type === 'Investment')}
                              checked={account.usesRMD}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, usesRMD: e.target.checked } : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              disabled={!(account.type === 'Investment')}
                              data={accounts.map((a) => ({ value: a.name, label: a.name }))}
                              value={account.rmdAccount || ''}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) => (a.id === account.id ? { ...a, rmdAccount: e } : a)),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              disabled={!(account.type === 'Investment')}
                              value={
                                account.accountOwnerDOB ? new Date(`${account.accountOwnerDOB}T00:00:00`) : undefined
                              }
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, accountOwnerDOB: e ? toDateString(e) : null } : a,
                                  ),
                                )
                              }
                              valueFormat="MM/DD/YYYY"
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                              value={account.minimumBalance || 0}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, minimumBalance: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                              value={account.minimumPullAmount || 0}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id
                                      ? { ...a, minimumPullAmount: typeof e === 'number' ? e : Number(e) }
                                      : a,
                                  ),
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>
                            <Center>
                              <Switch
                                disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                                checked={account.performsPulls}
                                onChange={(e) =>
                                  setEditingAccountsList(
                                    editingAccountsList.map((a) =>
                                      a.id === account.id ? { ...a, performsPulls: e.target.checked } : a,
                                    ),
                                  )
                                }
                              />
                            </Center>
                          </Table.Td>
                          <Table.Td>
                            <Center>
                              <Switch
                                disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                                checked={account.performsPushes}
                                onChange={(e) =>
                                  setEditingAccountsList(
                                    editingAccountsList.map((a) =>
                                      a.id === account.id ? { ...a, performsPushes: e.target.checked } : a,
                                    ),
                                  )
                                }
                              />
                            </Center>
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                              value={account.pushStart ? new Date(`${account.pushStart}T00:00:00`) : undefined}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, pushStart: e ? toDateString(e) : null } : a,
                                  ),
                                )
                              }
                              valueFormat="MM/DD/YYYY"
                            />
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                              value={account.pushEnd ? new Date(`${account.pushEnd}T00:00:00`) : undefined}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) =>
                                    a.id === account.id ? { ...a, pushEnd: e ? toDateString(e) : null } : a,
                                  ),
                                )
                              }
                              valueFormat="MM/DD/YYYY"
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              disabled={!(account.type === 'Checking' || account.type === 'Savings')}
                              data={accounts.map((a) => ({ value: a.name, label: a.name }))}
                              value={account.pushAccount || ''}
                              onChange={(e) =>
                                setEditingAccountsList(
                                  editingAccountsList.map((a) => (a.id === account.id ? { ...a, pushAccount: e } : a)),
                                )
                              }
                            />
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
              </Table>
            </Box>
            <Button
              onClick={() => {
                dispatch(editAccounts(editingAccountsList));
                closeEditingAccounts();
                resetEditingAccounts();
              }}
            >
              Save
            </Button>
          </Stack>
        </Modal>
      </Stack>
    </>
  );
}
