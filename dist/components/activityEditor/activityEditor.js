import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEndDate, selectNames, selectNamesLoaded, selectSelectedActivity, selectSelectedActivityBillId, selectSelectedActivityInterestId, selectSelectedActivityLoaded, selectStartDate, } from '../../features/activities/select';
import { ActionIcon, Button, Checkbox, FocusTrap, Group, LoadingOverlay, NumberInput, Select, Stack, Text, TextInput, useMantineTheme, } from '@mantine/core';
import { updateActivity } from '../../features/activities/slice';
import { selectCategories, selectCategoriesLoaded } from '../../features/categories/select';
import { selectAccountsLoaded, selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { removeActivity, saveActivity } from '../../features/activities/actions';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { IconVariable, IconVariableOff } from '@tabler/icons-react';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
import CreatableSelect from '../helpers/creatableSelect';
import { useEffect, useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { FlagSelect } from '../helpers/flagSelect';
export const ActivityEditor = ({ resetSelected }) => {
    const selectedActivity = useSelector(selectSelectedActivity);
    const activityId = selectedActivity?.id;
    const categories = Object.entries(useSelector(selectCategories)).map(([group, items]) => ({
        group,
        items: items.map((item) => ({
            value: `${group}.${item}`,
            label: item,
        })),
    }));
    const accounts = useSelector(selectAllAccounts);
    const [accountList, setAccountList] = useState([]);
    useEffect(() => {
        const accList = {};
        for (const account of accounts) {
            if (!(account.type in accList)) {
                accList[account.type] = [];
            }
            accList[account.type].push({
                value: account.name,
                label: account.name,
            });
        }
        setAccountList(Object.entries(accList).map(([group, items]) => ({
            group,
            items,
        })));
    }, [accounts]);
    const account = useSelector(selectSelectedAccount);
    const startDate = new Date(useSelector(selectStartDate));
    const endDate = new Date(useSelector(selectEndDate));
    const graphStartDate = new Date(useSelector(selectGraphStartDate));
    const graphEndDate = new Date(useSelector(selectGraphEndDate));
    const selectedBillId = useSelector(selectSelectedActivityBillId);
    const selectedInterestId = useSelector(selectSelectedActivityInterestId);
    const dispatch = useDispatch();
    const names = useSelector(selectNames);
    const accountsLoaded = useSelector(selectAccountsLoaded);
    const activityLoaded = useSelector(selectSelectedActivityLoaded);
    const categoriesLoaded = useSelector(selectCategoriesLoaded);
    const namesLoaded = useSelector(selectNamesLoaded);
    const [categoryTouched, setCategoryTouched] = useState(false);
    const simulationVariables = useSelector(selectSelectedSimulationVariables);
    const amountVariables = simulationVariables
        ? Object.entries(simulationVariables)
            .filter(([_, value]) => value.type === 'amount')
            .map(([name, _]) => name)
        : [];
    const dateVariables = simulationVariables
        ? Object.entries(simulationVariables)
            .filter(([_, value]) => value.type === 'date')
            .map(([name, _]) => name)
        : [];
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const isLoading = !activityLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [activityLoaded, accountsLoaded, categoriesLoaded, namesLoaded]);
    if (!account) {
        return React.createElement(Text, null, "No account selected");
    }
    if (!selectedActivity) {
        return React.createElement(Text, null, "No activity selected");
    }
    const theme = useMantineTheme();
    const validate = (name, value) => {
        if (name === 'dateVariable') {
            if (selectedActivity.dateIsVariable) {
                if (!dateVariables.includes(value)) {
                    return 'Invalid date';
                }
            }
        }
        if (name === 'date') {
            const date = new Date(value);
            if (date.toString() === 'Invalid Date') {
                return 'Invalid date';
            }
        }
        if (name === 'amountVariable') {
            if (selectedActivity.amountVariable) {
                if (!amountVariables.includes(value) && value !== '{HALF}' && value !== '{FULL}') {
                    return 'Invalid amount';
                }
            }
        }
        if (name === 'amount') {
            if (isNaN(value) || typeof value === 'boolean') {
                return 'Invalid amount';
            }
        }
        if (name === 'isTransfer') {
            if (typeof value !== 'boolean') {
                return 'Invalid isTransfer';
            }
        }
        if (name === 'flag') {
            if (typeof value !== 'boolean') {
                return 'Invalid flag';
            }
        }
        if (name === 'flagColor') {
            if (value !== null && !theme.colors[value]) {
                return 'Invalid flagColor';
            }
        }
        if (name === 'from' || name === 'to') {
            if (selectedActivity && !selectedActivity.isTransfer) {
                return null;
            }
            if (!accountList.find((a) => a.items.find((i) => i.value === value))) {
                return 'Invalid account';
            }
        }
        if (name === 'category') {
            if (!categories.find((c) => !!c.items.find((i) => i.value === value))) {
                return 'Invalid category';
            }
        }
        if (name === 'name') {
            if (!selectedActivity.name || selectedActivity.name.trim() === '') {
                return 'Invalid name';
            }
        }
        if (name === 'healthcarePerson') {
            if (selectedActivity.isHealthcare && (!value || value.trim() === '')) {
                return 'Person name is required for healthcare expenses';
            }
        }
        if (name === 'isHealthcare') {
            // When healthcare is checked, validate that person name is not empty
            if (value === true && (!selectedActivity.healthcarePerson || selectedActivity.healthcarePerson.trim() === '')) {
                return 'Person name is required for healthcare expenses';
            }
        }
        if (name === 'coinsurancePercent') {
            if (value !== null && value !== undefined && value !== '') {
                const numValue = Number(value);
                if (!isNaN(numValue) && (numValue < 0 || numValue > 100)) {
                    return 'Coinsurance must be between 0% and 100%';
                }
            }
        }
        return null;
    };
    const allValid = (activity) => {
        return Object.entries(activity || selectedActivity).every(([key, value]) => {
            return validate(key, value) === null;
        });
    };
    const getAmount = (activity) => {
        if (activity.isTransfer) {
            return Math.abs(Number(activity.amount));
        }
        return Number(activity.amount);
    };
    const save = (activity) => {
        const activityToSave = {
            ...(activity || selectedActivity),
            amount: getAmount(activity || selectedActivity),
        };
        dispatch(saveActivity(account, activityToSave, startDate, endDate, graphStartDate, graphEndDate, selectedBillId, selectedInterestId));
        resetSelected();
    };
    const handleEnter = (amount) => {
        if (isNaN(amount)) {
            return;
        }
        const activity = {
            ...selectedActivity,
            amount: amount || selectedActivity.amount,
        };
        if (!allValid(activity)) {
            return;
        }
        save(activity);
    };
    return (React.createElement(Stack, { h: "100%", w: "100%", justify: "space-between", pos: "relative" },
        React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
        selectedActivity ? (React.createElement(React.Fragment, null,
            React.createElement(FocusTrap.InitialFocus, null),
            React.createElement(Group, { w: "100%" },
                !selectedActivity.dateIsVariable && (React.createElement(EditableDateInput, { style: { flex: 1 }, label: "Date", value: selectedActivity.date, onBlur: (value) => {
                        if (!value)
                            return;
                        dispatch(updateActivity({
                            ...selectedActivity,
                            date: value,
                        }));
                    }, placeholder: "Date" })),
                selectedActivity.dateIsVariable && (React.createElement(Select, { style: { flex: 1 }, label: "Date", value: selectedActivity.dateVariable, data: dateVariables.map((v) => ({ label: v, value: v })), onChange: (v) => {
                        if (!v)
                            return;
                        dispatch(updateActivity({
                            ...selectedActivity,
                            dateVariable: v,
                        }));
                    }, error: validate('dateVariable', selectedActivity.dateVariable) })),
                React.createElement(ActionIcon, { mt: (selectedActivity.dateIsVariable && !validate('dateVariable', selectedActivity.dateVariable)) ||
                        (!selectedActivity.dateIsVariable && !validate('date', selectedActivity.date))
                        ? 22
                        : 2, ml: -12, onClick: () => {
                        dispatch(updateActivity({
                            ...selectedActivity,
                            dateIsVariable: !selectedActivity.dateIsVariable,
                        }));
                    } }, selectedActivity.dateIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null))),
            React.createElement(CreatableSelect, { label: "Name", error: validate('name', selectedActivity.name), value: selectedActivity.name, onChange: (v) => {
                    const newActivity = {
                        ...selectedActivity,
                        name: v || '',
                    };
                    if (!categoryTouched && v && v in names) {
                        newActivity.category = names[v];
                    }
                    dispatch(updateActivity(newActivity));
                }, data: Object.entries(names).map(([key, _value]) => ({
                    label: key,
                    value: key,
                })), clearable: true }),
            React.createElement(Select, { label: "Category", value: selectedActivity.category, data: categories, onChange: (v) => {
                    dispatch(updateActivity({
                        ...selectedActivity,
                        category: v ? v : '',
                    }));
                    setCategoryTouched(true);
                }, searchable: true, error: validate('category', selectedActivity.category) }),
            React.createElement(Checkbox, { label: "Healthcare Expense", checked: selectedActivity.isHealthcare ?? false, onChange: (event) => {
                    dispatch(updateActivity({
                        ...selectedActivity,
                        isHealthcare: event.currentTarget.checked,
                    }));
                }, error: validate('isHealthcare', selectedActivity.isHealthcare) }),
            selectedActivity.isHealthcare && (React.createElement(Stack, { gap: "sm", p: "md", style: { backgroundColor: theme.colors.dark[6], borderRadius: 4 } },
                React.createElement(TextInput, { label: "Person Name", value: selectedActivity.healthcarePerson || '', onChange: (e) => {
                        dispatch(updateActivity({
                            ...selectedActivity,
                            healthcarePerson: e.target.value || null,
                        }));
                    }, placeholder: "e.g., John, Jane", description: "Which family member is this expense for?", required: true, error: validate('healthcarePerson', selectedActivity.healthcarePerson) }),
                React.createElement(Group, { grow: true },
                    React.createElement(NumberInput, { label: "Copay Amount", value: selectedActivity.copayAmount ?? '', onChange: (v) => {
                            dispatch(updateActivity({
                                ...selectedActivity,
                                copayAmount: v !== '' && typeof v === 'number' ? v : null,
                            }));
                        }, placeholder: "25.00", description: "Fixed copay (e.g., $25 for doctor visit). Leave empty if using deductible/coinsurance.", prefix: "$", min: 0, decimalScale: 2 }),
                    React.createElement(NumberInput, { label: "Coinsurance Percent", value: selectedActivity.coinsurancePercent ?? '', onChange: (v) => {
                            dispatch(updateActivity({
                                ...selectedActivity,
                                coinsurancePercent: v !== '' && typeof v === 'number' ? v : null,
                            }));
                        }, placeholder: "20", description: "Percentage you pay (e.g., 20 for 20%). Used after deductible is met.", suffix: "%", min: 0, error: validate('coinsurancePercent', selectedActivity.coinsurancePercent) })),
                React.createElement(Checkbox, { label: "Counts toward deductible", checked: selectedActivity.countsTowardDeductible ?? true, onChange: (e) => {
                        dispatch(updateActivity({
                            ...selectedActivity,
                            countsTowardDeductible: e.currentTarget.checked,
                        }));
                    }, description: "Usually yes, except for some preventive care or copays" }),
                React.createElement(Checkbox, { label: "Counts toward out-of-pocket maximum", checked: selectedActivity.countsTowardOutOfPocket ?? true, onChange: (e) => {
                        dispatch(updateActivity({
                            ...selectedActivity,
                            countsTowardOutOfPocket: e.currentTarget.checked,
                        }));
                    }, description: "Usually yes for all patient costs" }))),
            React.createElement(Checkbox, { label: "Is this a transfer?", checked: selectedActivity.isTransfer, onChange: (event) => {
                    dispatch(updateActivity({
                        ...selectedActivity,
                        isTransfer: event.currentTarget.checked,
                    }));
                }, error: validate('isTransfer', selectedActivity.isTransfer) }),
            selectedActivity.isTransfer && (React.createElement(React.Fragment, null,
                React.createElement(Select, { label: "From Account", value: selectedActivity.from, data: accountList, searchable: true, placeholder: "Select an account", onChange: (v) => {
                        dispatch(updateActivity({ ...selectedActivity, from: v }));
                    }, error: validate('from', selectedActivity.from) }),
                React.createElement(Select, { label: "To Account", value: selectedActivity.to, data: accountList, searchable: true, placeholder: "Select an account", onChange: (v) => {
                        dispatch(updateActivity({ ...selectedActivity, to: v }));
                    }, error: validate('to', selectedActivity.to) }))),
            React.createElement(Group, { w: "100%" },
                ((!selectedActivity.amountIsVariable ||
                    selectedActivity.amountVariable === '{HALF}' ||
                    selectedActivity.amountVariable === '{FULL}') && (React.createElement(Group, { w: "100%", style: { flex: 1 } },
                    React.createElement(CalculatorEditor, { style: { flex: 1 }, label: "Amount", value: selectedActivity.isTransfer
                            ? Math.abs(Number(selectedActivity.amount))
                            : Number(selectedActivity.amount), onChange: (v) => {
                            dispatch(updateActivity({
                                ...selectedActivity,
                                amount: v,
                            }));
                        }, error: validate('amount', selectedActivity.amount) || undefined, handleEnter: handleEnter })))) || (React.createElement(Select, { style: { flex: 1 }, label: "Amount", value: selectedActivity.amountVariable, data: amountVariables.map((v) => ({ label: v, value: v })), onChange: (v) => {
                        if (!v)
                            return;
                        dispatch(updateActivity({
                            ...selectedActivity,
                            amountVariable: v,
                        }));
                    }, error: validate('amountVariable', selectedActivity.amountVariable) })),
                React.createElement(ActionIcon, { mt: (selectedActivity.amountIsVariable && !validate('amountVariable', selectedActivity.amountVariable)) ||
                        (!selectedActivity.amountIsVariable && !validate('amount', selectedActivity.amount))
                        ? 22
                        : 2, ml: -12, onClick: () => {
                        dispatch(updateActivity({
                            ...selectedActivity,
                            amountIsVariable: !selectedActivity.amountIsVariable,
                        }));
                    } }, selectedActivity.amountIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null))),
            React.createElement(FlagSelect, { flagColor: selectedActivity.flagColor, onChange: (v) => {
                    dispatch(updateActivity({ ...selectedActivity, flagColor: v.flagColor, flag: v.flag }));
                }, dropdownProps: {
                    zIndex: 1001,
                    withinPortal: true,
                    position: 'bottom',
                } }),
            React.createElement(Group, { w: "100%", grow: true },
                React.createElement(Button, { disabled: !allValid(), onClick: () => {
                        save();
                    } }, "Save"),
                React.createElement(Button, { disabled: !selectedActivity.id || !!selectedBillId, onClick: () => {
                        dispatch(removeActivity(account, activityId, selectedActivity.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                        resetSelected();
                    } }, "Remove")))) : (React.createElement(Text, null, "No activity selected"))));
};
