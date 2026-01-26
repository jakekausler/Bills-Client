import React from 'react';
import { Button, Group, LoadingOverlay, Modal, Select, Stack, Table, useMantineTheme } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectActivitiesLoaded, selectAllActivities, selectEndDate, selectInterests, selectSelectedActivity, selectSelectedBill, selectStartDate, } from '../../features/activities/select';
import { duplicateActivity, setSelectedActivity, setSelectedBill, updateInterests, } from '../../features/activities/slice';
import { changeAccountForActivity, changeAccountForBill, loadAndDuplicateBill, loadAndSelectBill, loadBillActivity, loadInterestActivity, loadInterests, loadNames, removeActivity, removeBill, saveInterests, skipBill as skipBillAction, skipInterest as skipInterestAction, } from '../../features/activities/actions';
import { BillEditor } from '../activityEditor/billEditor';
import { InterestEditor } from '../activityEditor/interestEditor';
import { ActivityEditor } from '../activityEditor/activityEditor';
import { selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { useEffect, useState } from 'react';
import { useContextMenu } from 'mantine-contextmenu';
import { IconCurrencyDollar, IconEdit, IconFlag, IconPlayerSkipForward, IconSwitch, IconTrash, IconCopy, } from '@tabler/icons-react';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
export default function Activities({ style }) {
    const activities = useSelector(selectAllActivities) || [];
    const currentActivity = useSelector(selectSelectedActivity);
    const currentBill = useSelector(selectSelectedBill);
    const interests = useSelector(selectInterests);
    const account = useSelector(selectSelectedAccount);
    const accountId = account?.id;
    const startDate = new Date(useSelector(selectStartDate));
    const endDate = new Date(useSelector(selectEndDate));
    const activitiesLoaded = useSelector(selectActivitiesLoaded);
    const graphStartDate = new Date(useSelector(selectGraphStartDate));
    const graphEndDate = new Date(useSelector(selectGraphEndDate));
    const accounts = useSelector(selectAllAccounts);
    const [editorActivity, setEditorActivity] = useState(null);
    const [editorChoice, setEditorChoice] = useState(null);
    const [changeAccountActivity, setChangeAccountActivity] = useState(null);
    const lastActivityBeforeToday = [...activities].reverse().find((a) => new Date(a.date) < new Date());
    const [showLoading, setShowLoading] = useState(false);
    const { showContextMenu } = useContextMenu();
    useEffect(() => {
        const isLoading = !activitiesLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [activitiesLoaded]);
    const dispatch = useDispatch();
    const resetSelected = () => {
        dispatch(setSelectedActivity(null));
        dispatch(setSelectedBill(null));
        dispatch(updateInterests(null));
        dispatch(loadNames());
    };
    const resetEditor = () => {
        setEditorActivity(null);
        setEditorChoice(null);
    };
    const openBillEditor = (activity) => {
        if (!accountId)
            return;
        dispatch(loadAndSelectBill(accountId, activity.billId, activity.isTransfer));
        resetEditor();
    };
    const openInterestEditor = () => {
        if (!accountId)
            return;
        dispatch(loadInterests(accountId));
        resetEditor();
    };
    const billAsActivityEditor = (activity) => {
        if (!accountId)
            return;
        dispatch(loadBillActivity(account, activity.billId, activity.isTransfer, startDate, endDate));
        resetEditor();
    };
    const interestAsActivityEditor = (activity) => {
        if (!accountId)
            return;
        dispatch(loadInterestActivity(accountId, activity.interestId, startDate, endDate));
        resetEditor();
    };
    const skipBill = (activity) => {
        if (!accountId)
            return;
        dispatch(skipBillAction(account, activity.billId, activity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
        resetEditor();
    };
    const skipInterest = () => {
        if (!accountId)
            return;
        dispatch(skipInterestAction(account, startDate, endDate, graphStartDate, graphEndDate));
        resetEditor();
    };
    const selectActivity = (activity) => {
        if (!activity)
            return;
        if (!activity.id || ['TAX', 'SOCIAL-SECURITY', 'PENSION'].includes(activity.id)) {
            return;
        }
        // Reset any existing selections first
        resetSelected();
        if (!!activity.billId && !!accountId) {
            if (activity.firstBill) {
                setEditorChoice('bill');
                setEditorActivity(activity);
            }
            else {
                dispatch(loadAndSelectBill(accountId, activity.billId, activity.isTransfer));
            }
        }
        else if (!!activity.interestId && !!accountId) {
            if (activity.firstInterest) {
                setEditorChoice('interest');
                setEditorActivity(activity);
            }
            else {
                dispatch(loadInterests(accountId));
            }
        }
        else if (accountId) {
            dispatch(setSelectedActivity(activity));
        }
    };
    const theme = useMantineTheme();
    return (React.createElement(React.Fragment, null,
        React.createElement(Stack, { pos: "relative", h: "100%" },
            React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
            React.createElement(Stack, { h: "100%", style: { ...style, overflow: 'auto' } },
                React.createElement(Table, { style: { width: '100%', tableLayout: 'auto' }, stickyHeader: true, stickyHeaderOffset: 0 },
                    React.createElement(Table.Thead, null,
                        React.createElement(Table.Tr, null,
                            React.createElement(Table.Th, null),
                            React.createElement(Table.Th, { fz: "xs" }, "Date"),
                            React.createElement(Table.Th, { fz: "xs" }, "Payee"),
                            React.createElement(Table.Th, { fz: "xs" }, "Category"),
                            React.createElement(Table.Th, { fz: "xs" }, "Amount"),
                            React.createElement(Table.Th, { fz: "xs" }, "Balance"))),
                    React.createElement(Table.Tbody, null, activities.map((activity, idx) => {
                        return (React.createElement(Table.Tr, { key: `${activity.id}-${idx}`, bg: idx % 2 === 0 ? 'gray.9' : '', onClick: () => selectActivity(activity), style: {
                                cursor: 'pointer',
                                borderBottom: activity.id === lastActivityBeforeToday?.id
                                    ? '4px solid var(--mantine-color-gray-6)'
                                    : undefined,
                            }, c: activity.flag
                                ? activity.flagColor
                                    ? theme.colors[activity.flagColor][activity.billId && activity.firstBill ? 6 : 4]
                                    : 'gray'
                                : '', fs: activity.billId ? 'italic' : undefined, fw: activity.firstBill ? 'bold' : activity.firstInterest ? 'bold' : '', onContextMenu: showContextMenu([
                                {
                                    key: 'edit',
                                    title: 'Edit',
                                    icon: React.createElement(IconEdit, { size: 16 }),
                                    onClick: () => {
                                        if ((activity.billId && activity.firstBill) ||
                                            (activity.interestId && activity.firstInterest)) {
                                            activity.billId
                                                ? dispatch(loadAndSelectBill(account?.id, activity.billId, activity.isTransfer))
                                                : dispatch(loadInterests(account?.id));
                                        }
                                        else {
                                            selectActivity(activity);
                                        }
                                    },
                                },
                                {
                                    key: 'delete',
                                    title: 'Delete',
                                    icon: React.createElement(IconTrash, { size: 16 }),
                                    onClick: () => {
                                        if (activity.billId) {
                                            dispatch(removeBill(account, activity.billId, activity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                                        }
                                        else if (activity.interestId) {
                                            dispatch(saveInterests(account, [], startDate, endDate, graphStartDate, graphEndDate));
                                        }
                                        else {
                                            dispatch(removeActivity(account, activity.id, activity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                                        }
                                    },
                                },
                                ...((activity.billId && activity.firstBill) || (activity.interestId && activity.firstInterest)
                                    ? [
                                        {
                                            key: 'enter',
                                            title: 'Enter',
                                            icon: React.createElement(IconCurrencyDollar, { size: 16 }),
                                            onClick: () => {
                                                activity.billId ? billAsActivityEditor(activity) : interestAsActivityEditor(activity);
                                            },
                                        },
                                        {
                                            key: 'skip',
                                            title: 'Skip',
                                            icon: React.createElement(IconPlayerSkipForward, { size: 16 }),
                                            onClick: () => {
                                                activity.billId ? skipBill(activity) : skipInterest();
                                            },
                                        },
                                    ]
                                    : []),
                                ...(!activity.interestId
                                    ? [
                                        {
                                            key: 'changeAccount',
                                            title: 'Change Account',
                                            icon: React.createElement(IconSwitch, { size: 16 }),
                                            onClick: () => {
                                                setChangeAccountActivity(activity);
                                            },
                                        },
                                        {
                                            key: 'duplicate',
                                            title: 'Duplicate',
                                            icon: React.createElement(IconCopy, { size: 16 }),
                                            onClick: () => {
                                                if (activity.billId && account) {
                                                    dispatch(loadAndDuplicateBill(account.id, activity.billId, activity.isTransfer));
                                                }
                                                else {
                                                    dispatch(duplicateActivity(activity));
                                                }
                                            },
                                        },
                                    ]
                                    : []),
                            ].sort((a, b) => {
                                const order = { enter: 0, edit: 1, skip: 2, delete: 3 };
                                return order[a.key] - order[b.key];
                            })) },
                            React.createElement(Table.Td, { fz: "xs" }, activity.flag ? (React.createElement(IconFlag, { color: activity.flagColor ? theme.colors[activity.flagColor][4] : 'gray', size: 16 })) : ('')),
                            React.createElement(Table.Td, { style: { whiteSpace: 'nowrap' }, fz: "xs" }, new Date(`${activity.date}T00:00:00`).toLocaleDateString()),
                            React.createElement(Table.Td, { fz: "xs" }, activity.name),
                            React.createElement(Table.Td, { fz: "xs" }, activity.category.split('.')[1]),
                            React.createElement(Table.Td, { fz: "xs", style: { whiteSpace: 'nowrap' }, c: activity.amount < 0 ? 'red' : 'green' }, '$ ' + activity.amount.toFixed(2)),
                            React.createElement(Table.Td, { fz: "xs", style: { whiteSpace: 'nowrap' }, c: activity.balance < 0 ? 'red' : 'green' }, '$ ' + activity.balance.toFixed(2))));
                    }))))),
        React.createElement(Modal, { opened: !!currentActivity || !!currentBill || !!interests, onClose: resetSelected, withCloseButton: false },
            currentBill && React.createElement(BillEditor, { resetSelected: resetSelected }),
            interests && React.createElement(InterestEditor, { resetSelected: resetSelected }),
            currentActivity && React.createElement(ActivityEditor, { resetSelected: resetSelected })),
        React.createElement(Modal, { opened: !!editorActivity && !!editorChoice, onClose: resetEditor, withCloseButton: false },
            React.createElement(Group, { w: "100%", grow: true },
                React.createElement(Button, { onClick: editorChoice === 'bill' ? () => openBillEditor(editorActivity) : () => openInterestEditor() },
                    "Edit ",
                    editorChoice),
                React.createElement(Button, { onClick: editorChoice === 'bill'
                        ? () => billAsActivityEditor(editorActivity)
                        : () => interestAsActivityEditor(editorActivity) },
                    "Enter ",
                    editorChoice),
                React.createElement(Button, { onClick: () => {
                        editorChoice === 'bill' ? skipBill(editorActivity) : skipInterest();
                    } },
                    "Skip ",
                    editorChoice))),
        React.createElement(Modal, { opened: !!changeAccountActivity, onClose: () => setChangeAccountActivity(null), withCloseButton: false },
            React.createElement(Stack, null,
                React.createElement(Select, { data: accounts.map((acc) => {
                        return {
                            value: acc.id,
                            label: acc.name,
                            disabled: acc.id === account?.id || acc.name === changeAccountActivity?.to,
                        };
                    }), value: undefined, onChange: (value) => {
                        if (!account || value === account.id || !changeAccountActivity)
                            return;
                        if (changeAccountActivity.billId) {
                            dispatch(changeAccountForBill(account, changeAccountActivity.billId, value, changeAccountActivity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                        }
                        else {
                            dispatch(changeAccountForActivity(account, changeAccountActivity.id, value, changeAccountActivity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                        }
                        setChangeAccountActivity(null);
                    } })))));
}
