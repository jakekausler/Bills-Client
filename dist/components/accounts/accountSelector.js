import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccountsLoaded, selectVisibleAccounts } from '../../features/accounts/select';
import { Box, LoadingOverlay, Stack, Table, Text, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { loadAccounts } from '../../features/accounts/actions';
import { CheckboxIcon } from '../helpers/checkboxIcon';
export default function AccountSelector({ selectedAccounts, updateSelectedAccounts, }) {
    const accounts = useSelector(selectVisibleAccounts);
    const accountsLoaded = useSelector(selectAccountsLoaded);
    const dispatch = useDispatch();
    const [showLoading, setShowLoading] = useState(false);
    const theme = useMantineTheme();
    useEffect(() => {
        dispatch(loadAccounts());
    }, []);
    useEffect(() => {
        const isLoading = !accountsLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [accountsLoaded]);
    useEffect(() => {
        dispatch(loadAccounts());
    }, [dispatch]);
    const accountsWithCategories = accounts.reduce((acc, account) => {
        if (!acc[account.type]) {
            acc[account.type] = [];
        }
        acc[account.type].push(account);
        return acc;
    }, {});
    return (React.createElement(Stack, { h: "100%", w: "100%", pos: "relative" },
        React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
        React.createElement(Table, { verticalSpacing: 4, withRowBorders: false },
            React.createElement(Table.Thead, null,
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Th, null, "Account"))),
            React.createElement(Table.Tbody, null,
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Td, null,
                        React.createElement(Text, { size: "xs", fw: 500 }, "Select All")),
                    React.createElement(Table.Td, null,
                        React.createElement(CheckboxIcon, { checked: selectedAccounts.length === accounts.length, onChange: () => dispatch(updateSelectedAccounts(selectedAccounts.length === accounts.length ? [] : accounts.map((a) => a.id))), checkedIcon: React.createElement(IconEye, { stroke: 1.5, color: theme.colors.orange[6], size: 16 }), uncheckedIcon: React.createElement(IconEyeOff, { stroke: 1.5, color: theme.colors.orange[6], size: 16 }) }))),
                Object.entries(accountsWithCategories).map(([type, accounts]) => (React.createElement(React.Fragment, { key: type },
                    React.createElement(Table.Tr, null,
                        React.createElement(Table.Td, null,
                            React.createElement(Box, { h: 8 }))),
                    React.createElement(Table.Tr, null,
                        React.createElement(Table.Td, null,
                            React.createElement(Text, { size: "xs", fw: 500 }, type)),
                        React.createElement(Table.Td, null,
                            React.createElement(CheckboxIcon, { checked: accounts.every((a) => selectedAccounts.includes(a.id)), onChange: () => dispatch(updateSelectedAccounts(accounts.every((a) => selectedAccounts.includes(a.id))
                                    ? selectedAccounts.filter((id) => !accounts.some((a) => a.id === id))
                                    : [...selectedAccounts, ...accounts.map((a) => a.id)])), checkedIcon: React.createElement(IconEye, { stroke: 1.5, color: theme.colors.blue[6], size: 16 }), uncheckedIcon: React.createElement(IconEyeOff, { stroke: 1.5, color: theme.colors.blue[6], size: 16 }) }))),
                    accounts.map((account) => (React.createElement(Table.Tr, { key: account.id },
                        React.createElement(Table.Td, null,
                            React.createElement(Text, { size: "xs" }, account.name)),
                        React.createElement(Table.Td, null,
                            React.createElement(CheckboxIcon, { checked: selectedAccounts.includes(account.id), onChange: () => dispatch(updateSelectedAccounts(selectedAccounts.includes(account.id)
                                    ? selectedAccounts.filter((a) => a !== account.id)
                                    : [...selectedAccounts, account.id])), checkedIcon: React.createElement(IconEye, { size: 16 }), uncheckedIcon: React.createElement(IconEyeOff, { size: 16 }) }))))))))))));
}
