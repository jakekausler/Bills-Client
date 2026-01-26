import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountsLoaded, selectSortedAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { loadActivities } from '../../features/activities/actions';
import { useEffect, useState, useMemo } from 'react';
import { ActionIcon, Box, Button, Center, Divider, Group, LoadingOverlay, Modal, NumberInput, Select, Stack, Switch, Table, Text, TextInput, } from '@mantine/core';
import { setSelectedAccount } from '../../features/accounts/slice';
import { loadGraphData } from '../../features/graph/actions';
import { selectStartDate } from '../../features/activities/select';
import { selectEndDate } from '../../features/activities/select';
import { selectGraphStartDate, selectGraphEndDate } from '../../features/graph/select';
import { IconEye, IconEyeOff, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { addAccount, editAccounts } from '../../features/accounts/actions';
import { shallowEqual } from 'react-redux';
import { CheckboxIcon } from '../helpers/checkboxIcon';
import { DateInput } from '@mantine/dates';
import { toDateString } from '../../utils/date';
const types = ['Checking', 'Savings', 'Credit', 'Loan', 'Investment', 'HSA', 'Other'];
const compareTypes = (a, b) => {
    return types.indexOf(a) - types.indexOf(b);
};
export default function AccountList({ close }) {
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
    const [addingAccountType, setAddingAccountType] = useState(null);
    const [editingAccountName, setEditingAccountName] = useState('');
    const [editingAccountsList, setEditingAccountsList] = useState([]);
    const dispatch = useDispatch();
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const isLoading = !loaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
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
    const accountsWithCategories = accounts.reduce((acc, account) => {
        if (account.hidden)
            return acc;
        if (!acc[account.type]) {
            acc[account.type] = [];
        }
        acc[account.type].push(account);
        return acc;
    }, {});
    const resetEditingAccounts = () => {
        setEditingAccountsList(accounts.map((account) => ({
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
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Stack, { h: "100%", pos: "relative", gap: 8 },
            React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
            Object.entries(accountsWithCategories).map(([type, accounts]) => (React.createElement(Stack, { key: type, gap: 4 },
                React.createElement(Group, { justify: "space-between" },
                    React.createElement(Text, { size: "xs", fw: 500, c: "dimmed" }, type),
                    React.createElement(ActionIcon, { h: 18, w: 27, mih: 0, miw: 0, onClick: () => {
                            setAddingAccountType(type);
                            setEditingAccountName('');
                            openAddingAccount();
                        } },
                        React.createElement(IconPlus, { size: "12px" }))),
                accounts.map((account) => (React.createElement(Button, { disabled: selectedAccount?.id === account.id, key: account.id, onClick: () => {
                        dispatch(setSelectedAccount(account));
                        close();
                    }, styles: {
                        label: { width: '100%' },
                    }, h: 32 },
                    React.createElement(Group, { w: "100%", justify: "space-between" },
                        React.createElement(Text, { size: "xs" }, account.name),
                        React.createElement(Text, { size: "xs", c: account.balance < 0 ? 'red' : 'green' }, `$ ${account.balance.toFixed(2)}`)))))))),
            React.createElement(Divider, null),
            React.createElement(Button, { onClick: () => {
                    openEditingAccounts();
                    resetEditingAccounts();
                } }, "Edit Accounts"),
            React.createElement(Modal, { opened: addingAccount, onClose: closeAddingAccount, title: "Add Account" },
                React.createElement(Stack, null,
                    React.createElement(TextInput, { placeholder: "Name", value: editingAccountName, onChange: (e) => setEditingAccountName(e.target.value) }),
                    React.createElement(Button, { disabled: !addingAccountType || !editingAccountName || editingAccountName === '', onClick: () => {
                            if (addingAccountType && editingAccountName !== '') {
                                dispatch(addAccount({
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
                                }));
                            }
                            closeAddingAccount();
                        } }, "Add"))),
            React.createElement(Modal, { opened: editingAccounts, onClose: closeEditingAccounts, title: "Edit Accounts", size: "xl" },
                React.createElement(Stack, null,
                    React.createElement(Box, { h: "60vh", style: { overflowY: 'auto', overflowX: 'auto' } },
                        React.createElement(Table, { miw: 500, style: { tableLayout: 'fixed' } },
                            React.createElement(Table.Thead, { bg: "dark.7", style: { position: 'sticky', top: 0, zIndex: 1 } },
                                React.createElement(Table.Tr, null,
                                    React.createElement(Table.Th, { ta: "center", w: 60 }, "Visible"),
                                    React.createElement(Table.Th, { ta: "center", w: 200 }, "Name"),
                                    React.createElement(Table.Th, { ta: "center", w: 150 }, "Type"),
                                    React.createElement(Table.Th, { ta: "center", w: 80 }, "Pull Priority"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Withdrawal Tax Rate"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Early Withdrawl Penalty"),
                                    React.createElement(Table.Th, { ta: "center", w: 120 }, "Early Withdrawl Date"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Interest Tax Rate"),
                                    React.createElement(Table.Th, { ta: "center", w: 200 }, "Interest Pay Account"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Uses RMD"),
                                    React.createElement(Table.Th, { ta: "center", w: 200 }, "RMD Account"),
                                    React.createElement(Table.Th, { ta: "center", w: 120 }, "Account Owner DOB"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Minimum Balance"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Minimum Pull Amount"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Perform Pulls"),
                                    React.createElement(Table.Th, { ta: "center", w: 100 }, "Perform Pushes"),
                                    React.createElement(Table.Th, { ta: "center", w: 120 }, "Push Start"),
                                    React.createElement(Table.Th, { ta: "center", w: 120 }, "Push End"),
                                    React.createElement(Table.Th, { ta: "center", w: 200 }, "Push Account"))),
                            React.createElement(Table.Tbody, null, editingAccountsList
                                .sort((a, b) => compareTypes(a.type, b.type) || a.name.localeCompare(b.name))
                                .map((account) => {
                                return (React.createElement(Table.Tr, { key: account.id },
                                    React.createElement(Table.Td, null,
                                        React.createElement(CheckboxIcon, { checked: account.hidden, onChange: (checked) => setEditingAccountsList(editingAccountsList.map((a) => (a.id === account.id ? { ...a, hidden: checked } : a))), checkedIcon: React.createElement(IconEyeOff, null), uncheckedIcon: React.createElement(IconEye, null) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(TextInput, { value: account.name, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, name: e.target.value } : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Select, { data: types.map((type) => ({ value: type, label: type })), value: account.type, onChange: (e) => e &&
                                                setEditingAccountsList(editingAccountsList.map((a) => (a.id === account.id ? { ...a, type: e } : a))) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Savings' || account.type === 'Investment'), value: account.pullPriority || -1, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, pullPriority: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Investment'), value: account.withdrawalTaxRate || 0, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, withdrawalTaxRate: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Investment'), value: account.earlyWithdrawlPenalty || 0, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, earlyWithdrawlPenalty: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(DateInput, { disabled: !(account.type === 'Investment'), value: account.earlyWithdrawlDate
                                                ? new Date(`${account.earlyWithdrawlDate}T00:00:00`)
                                                : undefined, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, earlyWithdrawlDate: e ? toDateString(e) : null } : a)), valueFormat: "MM/DD/YYYY" })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Savings'), value: account.interestTaxRate || 0, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, interestTaxRate: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Select, { disabled: !(account.type === 'Savings'), data: accounts.map((a) => ({ value: a.name, label: a.name })), value: account.interestPayAccount || '', onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, interestPayAccount: e } : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Switch, { disabled: !(account.type === 'Investment'), checked: account.usesRMD, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, usesRMD: e.target.checked } : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Select, { disabled: !(account.type === 'Investment'), data: accounts.map((a) => ({ value: a.name, label: a.name })), value: account.rmdAccount || '', onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => (a.id === account.id ? { ...a, rmdAccount: e } : a))) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(DateInput, { disabled: !(account.type === 'Investment'), value: account.accountOwnerDOB ? new Date(`${account.accountOwnerDOB}T00:00:00`) : undefined, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, accountOwnerDOB: e ? toDateString(e) : null } : a)), valueFormat: "MM/DD/YYYY" })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), value: account.minimumBalance || 0, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, minimumBalance: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(NumberInput, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), value: account.minimumPullAmount || 0, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id
                                                ? { ...a, minimumPullAmount: typeof e === 'number' ? e : Number(e) }
                                                : a)) })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Center, null,
                                            React.createElement(Switch, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), checked: account.performsPulls, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, performsPulls: e.target.checked } : a)) }))),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Center, null,
                                            React.createElement(Switch, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), checked: account.performsPushes, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, performsPushes: e.target.checked } : a)) }))),
                                    React.createElement(Table.Td, null,
                                        React.createElement(DateInput, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), value: account.pushStart ? new Date(`${account.pushStart}T00:00:00`) : undefined, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, pushStart: e ? toDateString(e) : null } : a)), valueFormat: "MM/DD/YYYY" })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(DateInput, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), value: account.pushEnd ? new Date(`${account.pushEnd}T00:00:00`) : undefined, onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => a.id === account.id ? { ...a, pushEnd: e ? toDateString(e) : null } : a)), valueFormat: "MM/DD/YYYY" })),
                                    React.createElement(Table.Td, null,
                                        React.createElement(Select, { disabled: !(account.type === 'Checking' || account.type === 'Savings'), data: accounts.map((a) => ({ value: a.name, label: a.name })), value: account.pushAccount || '', onChange: (e) => setEditingAccountsList(editingAccountsList.map((a) => (a.id === account.id ? { ...a, pushAccount: e } : a))) }))));
                            })))),
                    React.createElement(Button, { onClick: () => {
                            dispatch(editAccounts(editingAccountsList));
                            closeEditingAccounts();
                            resetEditingAccounts();
                        } }, "Save"))))));
}
