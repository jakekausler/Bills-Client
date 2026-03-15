import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountsLoaded, selectSortedAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { loadActivities } from '../../features/activities/actions';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { useEffect, useMemo, useState, useCallback } from 'react';
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
  VisuallyHidden,
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

interface EditAccountRowProps {
  account: Account;
  allAccounts: Account[];
  onUpdateAccount: (updatedAccount: Account) => void;
}

const EditAccountRow = React.memo(({ account, allAccounts, onUpdateAccount }: EditAccountRowProps) => {
  const handleUpdate = useCallback(
    (updates: Partial<Account>) => {
      onUpdateAccount({ ...account, ...updates });
    },
    [account, onUpdateAccount]
  );

  return (
    <Table.Tr key={account.id}>
      <Table.Td>
        <CheckboxIcon
          checked={account.hidden}
          onChange={(checked) => handleUpdate({ hidden: checked })}
          checkedIcon={<IconEyeOff />}
          uncheckedIcon={<IconEye />}
          ariaLabel={`Toggle visibility for ${account.name}`}
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          value={account.name}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          aria-label="Account name"
        />
      </Table.Td>
      <Table.Td>
        <Select
          data={types.map((type) => ({ value: type, label: type }))}
          value={account.type}
          onChange={(e) => e && handleUpdate({ type: e })}
          aria-label="Account type"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Savings' || account.type === 'Investment')}
          value={account.pullPriority ?? -1}
          onChange={(e) => handleUpdate({ pullPriority: typeof e === 'number' ? e : Number(e) })}
          aria-label="Pull priority"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Investment')}
          value={account.withdrawalTaxRate ?? 0}
          onChange={(e) => handleUpdate({ withdrawalTaxRate: typeof e === 'number' ? e : Number(e) })}
          aria-label="Withdrawal tax rate"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Investment')}
          value={account.expenseRatio ?? 0}
          onChange={(e) => handleUpdate({ expenseRatio: typeof e === 'number' ? e : Number(e) })}
          decimalScale={4}
          step={0.001}
          min={0}
          max={0.1}
          aria-label="Expense ratio"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Investment')}
          value={account.earlyWithdrawalPenalty ?? 0}
          onChange={(e) => handleUpdate({ earlyWithdrawalPenalty: typeof e === 'number' ? e : Number(e) })}
          aria-label="Early withdrawal penalty"
        />
      </Table.Td>
      <Table.Td>
        <DateInput
          disabled={!(account.type === 'Investment')}
          value={
            account.earlyWithdrawalDate
              ? new Date(`${account.earlyWithdrawalDate}T00:00:00`)
              : undefined
          }
          onChange={(e) => handleUpdate({ earlyWithdrawalDate: e ? toDateString(e) : null })}
          valueFormat="MM/DD/YYYY"
          aria-label="Early withdrawal date"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Savings')}
          value={account.interestTaxRate ?? 0}
          onChange={(e) => handleUpdate({ interestTaxRate: typeof e === 'number' ? e : Number(e) })}
          aria-label="Interest tax rate"
        />
      </Table.Td>
      <Table.Td>
        <Center>
          <Switch
            checked={account.interestAppliesToPositiveBalance}
            onChange={(e) => handleUpdate({ interestAppliesToPositiveBalance: e.target.checked })}
            aria-label="Interest on positive balance"
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <Select
          disabled={!(account.type === 'Savings')}
          data={allAccounts.map((a) => ({ value: a.name, label: a.name }))}
          value={account.interestPayAccount || ''}
          onChange={(e) => handleUpdate({ interestPayAccount: e })}
          aria-label="Interest pay account"
        />
      </Table.Td>
      <Table.Td>
        <Switch
          disabled={!(account.type === 'Investment')}
          checked={account.usesRMD}
          onChange={(e) => handleUpdate({ usesRMD: e.target.checked })}
          aria-label="Uses RMD"
        />
      </Table.Td>
      <Table.Td>
        <Select
          disabled={!(account.type === 'Investment')}
          data={allAccounts.map((a) => ({ value: a.name, label: a.name }))}
          value={account.rmdAccount || ''}
          onChange={(e) => handleUpdate({ rmdAccount: e })}
          aria-label="RMD account"
        />
      </Table.Td>
      <Table.Td>
        <DateInput
          disabled={!(account.type === 'Investment')}
          value={
            account.accountOwnerDOB ? new Date(`${account.accountOwnerDOB}T00:00:00`) : undefined
          }
          onChange={(e) => handleUpdate({ accountOwnerDOB: e ? toDateString(e) : null })}
          valueFormat="MM/DD/YYYY"
          aria-label="Account owner date of birth"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          value={account.minimumBalance ?? 0}
          onChange={(e) => handleUpdate({ minimumBalance: typeof e === 'number' ? e : Number(e) })}
          aria-label="Minimum balance"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          value={account.maximumBalance ?? 0}
          onChange={(e) => handleUpdate({ maximumBalance: typeof e === 'number' ? e : Number(e) })}
          aria-label="Maximum balance"
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          value={account.minimumPullAmount ?? 0}
          onChange={(e) => handleUpdate({ minimumPullAmount: typeof e === 'number' ? e : Number(e) })}
          aria-label="Minimum pull amount"
        />
      </Table.Td>
      <Table.Td>
        <Center>
          <Switch
            disabled={!(account.type === 'Checking' || account.type === 'Savings')}
            checked={account.performsPulls}
            onChange={(e) => handleUpdate({ performsPulls: e.target.checked })}
            aria-label="Perform pulls"
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <Switch
            disabled={!(account.type === 'Checking' || account.type === 'Savings')}
            checked={account.performsPushes}
            onChange={(e) => handleUpdate({ performsPushes: e.target.checked })}
            aria-label="Perform pushes"
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <DateInput
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          value={account.pushStart ? new Date(`${account.pushStart}T00:00:00`) : undefined}
          onChange={(e) => handleUpdate({ pushStart: e ? toDateString(e) : null })}
          valueFormat="MM/DD/YYYY"
          aria-label="Push start date"
        />
      </Table.Td>
      <Table.Td>
        <DateInput
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          value={account.pushEnd ? new Date(`${account.pushEnd}T00:00:00`) : undefined}
          onChange={(e) => handleUpdate({ pushEnd: e ? toDateString(e) : null })}
          valueFormat="MM/DD/YYYY"
          aria-label="Push end date"
        />
      </Table.Td>
      <Table.Td>
        <Select
          disabled={!(account.type === 'Checking' || account.type === 'Savings')}
          data={allAccounts.map((a) => ({ value: a.name, label: a.name }))}
          value={account.pushAccount || ''}
          onChange={(e) => handleUpdate({ pushAccount: e })}
          aria-label="Push account"
        />
      </Table.Td>
    </Table.Tr>
  );
});

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

  const showLoading = useDelayedLoading(!loaded);

  useEffect(() => {
    if (selectedAccount) {
      dispatch(loadActivities(selectedAccount, startDateObj, endDateObj));
      dispatch(loadGraphData(selectedAccount, graphStartDateObj, graphEndDateObj));
    }
  }, [selectedAccount, startDateObj, endDateObj, graphStartDateObj, graphEndDateObj, dispatch]);

  useEffect(() => {
    if (loaded && accounts.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(accounts[0]));
    }
  }, [loaded, accounts, selectedAccount, startDate, endDate, dispatch]);

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
        expenseRatio: account.expenseRatio,
        earlyWithdrawalPenalty: account.earlyWithdrawalPenalty,
        earlyWithdrawalDate: account.earlyWithdrawalDate,
        interestPayAccount: account.interestPayAccount,
        usesRMD: account.usesRMD,
        accountOwnerDOB: account.accountOwnerDOB,
        rmdAccount: account.rmdAccount,
        minimumBalance: account.minimumBalance,
        maximumBalance: account.maximumBalance,
        minimumPullAmount: account.minimumPullAmount,
        performsPulls: account.performsPulls,
        performsPushes: account.performsPushes,
        pushStart: account.pushStart,
        pushEnd: account.pushEnd,
        pushAccount: account.pushAccount,
        interestAppliesToPositiveBalance: account.interestAppliesToPositiveBalance,
      })),
    );
  };

  return (
    <>
      <Stack h="100%" pos="relative" gap={8} aria-busy={showLoading}>
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
                aria-label="Add account"
              >
                <IconPlus size="12px" />
              </ActionIcon>
            </Group>
            {accounts.map((account) => (
              <Button
                disabled={selectedAccount?.id === account.id}
                aria-current={selectedAccount?.id === account.id ? 'true' : undefined}
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
                    <VisuallyHidden>{account.balance < 0 ? '(negative)' : '(positive)'}</VisuallyHidden>
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
              aria-label="Account name"
            />
            <Button
              disabled={!addingAccountType || !editingAccountName || editingAccountName === ''}
              onClick={async () => {
                try {
                  if (addingAccountType && editingAccountName !== '') {
                    await dispatch(
                      addAccount({
                        type: addingAccountType,
                        name: editingAccountName,
                        balance: 0,
                        hidden: false,
                        id: '',
                        pullPriority: -1,
                        interestTaxRate: 0,
                        withdrawalTaxRate: 0,
                        expenseRatio: 0,
                        earlyWithdrawalPenalty: 0,
                        earlyWithdrawalDate: null,
                        interestPayAccount: null,
                        usesRMD: false,
                        accountOwnerDOB: null,
                        rmdAccount: null,
                        minimumBalance: null,
                        maximumBalance: null,
                        minimumPullAmount: null,
                        performsPulls: false,
                        performsPushes: false,
                        pushStart: null,
                        pushEnd: null,
                        pushAccount: null,
                        interestAppliesToPositiveBalance: true,
                      }),
                    );
                  }
                  closeAddingAccount();
                } catch (error) {
                  console.error('Failed to add account:', error);
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Modal>
        <Modal opened={editingAccounts} onClose={closeEditingAccounts} title="Edit Accounts" size="xl">
          <Stack>
            <Box h="60vh" style={{ overflowY: 'auto', overflowX: 'auto' }}>
              <Table miw={500} style={{ tableLayout: 'fixed' }} aria-label="Account balances">
                <Table.Thead bg="var(--mantine-color-body)" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <Table.Tr>
                    <Table.Th scope="col" ta="center" w={60}>
                      Visible
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={200}>
                      Name
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={150}>
                      Type
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={80}>
                      Pull Priority
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Withdrawal Tax Rate
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Expense Ratio
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Early Withdrawl Penalty
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={120}>
                      Early Withdrawl Date
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Interest Tax Rate
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={150}>
                      Interest On Positive
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={200}>
                      Interest Pay Account
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Uses RMD
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={200}>
                      RMD Account
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={120}>
                      Account Owner DOB
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Minimum Balance
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Maximum Balance
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Minimum Pull Amount
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Perform Pulls
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={100}>
                      Perform Pushes
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={120}>
                      Push Start
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={120}>
                      Push End
                    </Table.Th>
                    <Table.Th scope="col" ta="center" w={200}>
                      Push Account
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {[...editingAccountsList]
                    .sort((a, b) => compareTypes(a.type, b.type) || a.name.localeCompare(b.name))
                    .map((account) => (
                      <EditAccountRow
                        key={account.id}
                        account={account}
                        allAccounts={editingAccountsList}
                        onUpdateAccount={useCallback((updatedAccount: Account) => {
                          setEditingAccountsList((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
                        }, [])}
                      />
                    ))}
                </Table.Tbody>
              </Table>
            </Box>
            <Button
              onClick={async () => {
                try {
                  await dispatch(editAccounts(editingAccountsList));
                  closeEditingAccounts();
                  resetEditingAccounts();
                } catch (error) {
                  console.error('Failed to edit accounts:', error);
                }
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
