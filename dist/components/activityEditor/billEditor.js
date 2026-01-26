import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEndDate, selectNames, selectNamesLoaded, selectSelectedBill, selectSelectedBillLoaded, selectStartDate, } from '../../features/activities/select';
import { ActionIcon, Button, Checkbox, FocusTrap, Group, LoadingOverlay, NumberInput, Select, Stack, Text, TextInput, useMantineTheme, } from '@mantine/core';
import { selectCategories, selectCategoriesLoaded } from '../../features/categories/select';
import { selectAccountsLoaded, selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { updateBill } from '../../features/activities/slice';
import { removeBill, saveBill } from '../../features/activities/actions';
import { IconVariable, IconVariableOff } from '@tabler/icons-react';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
import CreatableSelect from '../helpers/creatableSelect';
import { useEffect, useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { FlagSelect } from '../helpers/flagSelect';
export const BillEditor = ({ resetSelected }) => {
    const selectedBill = useSelector(selectSelectedBill);
    const billId = selectedBill?.id;
    const categories = Object.entries(useSelector(selectCategories)).map(([group, items]) => ({
        group,
        items: items.map((item) => ({
            value: `${group}.${item}`,
            label: item,
        })),
    }));
    const accounts = useSelector(selectAllAccounts);
    const account = useSelector(selectSelectedAccount);
    const startDate = new Date(useSelector(selectStartDate));
    const endDate = new Date(useSelector(selectEndDate));
    const graphStartDate = new Date(useSelector(selectGraphStartDate));
    const graphEndDate = new Date(useSelector(selectGraphEndDate));
    const billLoaded = useSelector(selectSelectedBillLoaded);
    const accountsLoaded = useSelector(selectAccountsLoaded);
    const categoriesLoaded = useSelector(selectCategoriesLoaded);
    const namesLoaded = useSelector(selectNamesLoaded);
    const dispatch = useDispatch();
    const [categoryTouched, setCategoryTouched] = useState(false);
    const names = useSelector(selectNames);
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
    useEffect(() => {
        const isLoading = !billLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [billLoaded, accountsLoaded, categoriesLoaded, namesLoaded]);
    const theme = useMantineTheme();
    const validate = (name, value) => {
        if (!selectedBill) {
            return null;
        }
        if (name === 'startDateVariable') {
            if (selectedBill.startDateIsVariable) {
                if (!dateVariables.includes(value)) {
                    return 'Invalid startDate';
                }
            }
        }
        if (name === 'startDate') {
            const date = new Date(value);
            if (date.toString() === 'Invalid Date') {
                return 'Invalid date';
            }
        }
        if (name === 'endDateVariable') {
            if (selectedBill.endDateIsVariable) {
                if (!!value && !dateVariables.includes(value)) {
                    return 'Invalid endDate';
                }
            }
        }
        if (name === 'endDate') {
            if (value === '' || value === undefined || value === null) {
                return null;
            }
            const date = new Date(value);
            if (date.toString() === 'Invalid Date') {
                return 'Invalid date';
            }
        }
        if (name === 'amountVariable') {
            if (selectedBill.amountIsVariable) {
                if (!amountVariables.includes(value) &&
                    value !== '{HALF}' &&
                    value !== '{FULL}' &&
                    value !== '-{HALF}' &&
                    value !== '-{FULL}') {
                    return 'Invalid amount';
                }
            }
        }
        if (name === 'amount') {
            if ((isNaN(value) || typeof value === 'boolean') &&
                value !== '{HALF}' &&
                value !== '{FULL}' &&
                value !== '-{HALF}' &&
                value !== '-{FULL}') {
                return 'Invalid amount';
            }
        }
        if (name === 'isTransfer') {
            if (typeof value !== 'boolean') {
                return 'Invalid isTransfer';
            }
        }
        if (name === 'from' || name === 'to') {
            if (selectedBill && !selectedBill.isTransfer) {
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
            if (!selectedBill.name || selectedBill.name.trim() === '') {
                return 'Invalid name';
            }
        }
        if (name === 'everyN') {
            if (isNaN(value) || typeof value === 'boolean') {
                return 'Invalid everyN';
            }
        }
        if (name === 'periods') {
            if (!['day', 'week', 'month', 'year'].includes(value)) {
                return 'Invalid periods';
            }
        }
        if (name === 'annualStartDate' || name === 'annualEndDate') {
            if (value === '' || value === undefined || value === null) {
                return null;
            }
            const dateParts = value.split('/');
            if (dateParts.length !== 2) {
                return 'Invalid date format - use MM/DD';
            }
            const month = parseInt(dateParts[0]);
            const day = parseInt(dateParts[1]);
            if (isNaN(month) || month < 1 || month > 12) {
                return 'Invalid month';
            }
            if (month < 10 && dateParts[0].length === 1) {
                return 'Please use 01, 02, 03, etc.';
            }
            if (day < 10 && dateParts[1].length === 1) {
                return 'Please use 01, 02, 03, etc.';
            }
            const daysInMonth = new Date(2024, month, 0).getUTCDate();
            if (isNaN(day) || day < 1 || day > daysInMonth) {
                return 'Invalid day for month';
            }
        }
        if (name === 'increaseBy') {
            if (isNaN(value) || typeof value === 'boolean') {
                return 'Invalid increaseBy';
            }
        }
        if (name === 'increaseByVariable') {
            if (selectedBill.increaseByIsVariable) {
                if (!amountVariables.includes(value)) {
                    return 'Invalid increaseBy';
                }
            }
        }
        if (name === 'increaseByDate') {
            const dateParts = value.split('/');
            if (dateParts.length !== 2) {
                return 'Invalid date format - use MM/DD';
            }
            const month = parseInt(dateParts[0]);
            const day = parseInt(dateParts[1]);
            if (isNaN(month) || month < 1 || month > 12) {
                return 'Invalid month';
            }
            if (month < 10 && dateParts[0].length === 1) {
                return 'Please use 01, 02, 03, etc.';
            }
            if (day < 10 && dateParts[1].length === 1) {
                return 'Please use 01, 02, 03, etc.';
            }
            const daysInMonth = new Date(2024, month, 0).getUTCDate();
            if (isNaN(day) || day < 1 || day > daysInMonth) {
                return 'Invalid day for month';
            }
        }
        if (name === 'flag') {
            if (typeof value !== 'boolean') {
                return 'Invalid flag';
            }
        }
        if (name === 'flagColor') {
            if (!theme.colors[value] && value !== null) {
                return 'Invalid flagColor';
            }
        }
        if (name === 'healthcarePerson') {
            if (selectedBill.isHealthcare && (!value || value.trim() === '')) {
                return 'Person name is required for healthcare expenses';
            }
        }
        if (name === 'isHealthcare') {
            // When healthcare is checked, validate that person name is not empty
            if (value === true && (!selectedBill.healthcarePerson || selectedBill.healthcarePerson.trim() === '')) {
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
    const allValid = (bill) => {
        if (!selectedBill && !bill) {
            return true;
        }
        return bill || selectedBill
            ? Object.entries(bill || selectedBill).every(([key, value]) => {
                return validate(key, value) === null;
            })
            : false;
    };
    const handleEnter = (amount) => {
        if (amount !== undefined && isNaN(amount)) {
            return;
        }
        const bill = selectedBill
            ? {
                ...selectedBill,
                amount: amount || selectedBill.amount,
            }
            : null;
        if (!allValid(bill)) {
            return;
        }
        dispatch(saveBill(account, selectedBill, startDate, endDate, graphStartDate, graphEndDate));
        resetSelected();
    };
    return (React.createElement(Stack, { h: "100%", w: "100%", justify: "space-between", pos: "relative" },
        React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
        selectedBill ? (React.createElement(React.Fragment, null,
            React.createElement(FocusTrap.InitialFocus, null),
            React.createElement(Group, { w: "100%" },
                React.createElement(Group, { w: "100%", style: { flex: 1 } },
                    !selectedBill.startDateIsVariable && (React.createElement(EditableDateInput, { style: { flex: 1 }, label: "Start date", value: selectedBill.startDate, onBlur: (value) => {
                            if (!value)
                                return;
                            dispatch(updateBill({
                                ...selectedBill,
                                startDate: value,
                            }));
                        }, placeholder: "Start date" })),
                    selectedBill.startDateIsVariable && (React.createElement(Select, { style: { flex: 1 }, label: "Start Date", value: selectedBill.startDateVariable, data: dateVariables.map((v) => ({ label: v, value: v })), onChange: (v) => {
                            if (!v)
                                return;
                            dispatch(updateBill({
                                ...selectedBill,
                                startDateVariable: v,
                            }));
                        }, error: validate('startDateVariable', selectedBill.startDateVariable) })),
                    React.createElement(ActionIcon, { mt: (selectedBill.startDateIsVariable &&
                            !validate('startDateVariable', selectedBill.startDateVariable)) ||
                            (!selectedBill.startDateIsVariable && !validate('startDate', selectedBill.startDate))
                            ? 22
                            : 2, ml: -12, onClick: () => {
                            dispatch(updateBill({
                                ...selectedBill,
                                startDateIsVariable: !selectedBill.startDateIsVariable,
                            }));
                        } }, selectedBill.startDateIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null))),
                React.createElement(Group, { w: "100%", style: { flex: 1 } },
                    !selectedBill.endDateIsVariable && (React.createElement(EditableDateInput, { style: { flex: 1 }, label: "End date", value: selectedBill.endDate, onBlur: (value) => {
                            dispatch(updateBill({
                                ...selectedBill,
                                endDate: value,
                            }));
                        }, placeholder: "End date", clearable: true })),
                    selectedBill.endDateIsVariable && (React.createElement(Select, { style: { flex: 1 }, label: "End Date", value: selectedBill.endDateVariable, data: dateVariables.map((v) => ({ label: v, value: v })), onChange: (v) => {
                            if (!v)
                                return;
                            dispatch(updateBill({
                                ...selectedBill,
                                endDateVariable: v,
                            }));
                        }, error: validate('endDateVariable', selectedBill.endDateVariable) })),
                    React.createElement(ActionIcon, { mt: (selectedBill.endDateIsVariable && !validate('endDateVariable', selectedBill.endDateVariable)) ||
                            (!selectedBill.endDateIsVariable && !validate('endDate', selectedBill.endDate))
                            ? 22
                            : 2, ml: -12, onClick: () => {
                            dispatch(updateBill({
                                ...selectedBill,
                                endDateIsVariable: !selectedBill.endDateIsVariable,
                            }));
                        } }, selectedBill.endDateIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null)))),
            React.createElement(CreatableSelect, { label: "Name", error: validate('name', selectedBill.name), value: selectedBill.name, onChange: (v) => {
                    const newBill = {
                        ...selectedBill,
                        name: v || '',
                    };
                    if (!categoryTouched && v && v in names) {
                        newBill.category = names[v];
                    }
                    dispatch(updateBill(newBill));
                }, data: Object.entries(names).map(([key, _value]) => ({
                    label: key,
                    value: key,
                })), clearable: true }),
            React.createElement(Select, { label: "Category", value: selectedBill.category, data: categories, onChange: (v) => {
                    dispatch(updateBill({
                        ...selectedBill,
                        category: v ? v : '',
                    }));
                    setCategoryTouched(true);
                }, searchable: true, error: validate('category', selectedBill.category) }),
            React.createElement(Checkbox, { label: "Healthcare Expense", checked: selectedBill.isHealthcare ?? false, onChange: (event) => {
                    dispatch(updateBill({
                        ...selectedBill,
                        isHealthcare: event.currentTarget.checked,
                    }));
                }, error: validate('isHealthcare', selectedBill.isHealthcare) }),
            selectedBill.isHealthcare && (React.createElement(Stack, { gap: "sm", p: "md", style: { backgroundColor: theme.colors.dark[6], borderRadius: 4 } },
                React.createElement(TextInput, { label: "Person Name", value: selectedBill.healthcarePerson || '', onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            healthcarePerson: e.target.value || null,
                        }));
                    }, placeholder: "e.g., John, Jane", description: "Which family member is this expense for?", required: true, error: validate('healthcarePerson', selectedBill.healthcarePerson) }),
                React.createElement(Group, { grow: true },
                    React.createElement(NumberInput, { label: "Copay Amount", value: selectedBill.copayAmount ?? '', onChange: (v) => {
                            dispatch(updateBill({
                                ...selectedBill,
                                copayAmount: v !== '' && typeof v === 'number' ? v : null,
                            }));
                        }, placeholder: "25.00", description: "Fixed copay (e.g., $25 for doctor visit). Leave empty if using deductible/coinsurance.", prefix: "$", min: 0, decimalScale: 2 }),
                    React.createElement(NumberInput, { label: "Coinsurance Percent", value: selectedBill.coinsurancePercent ?? '', onChange: (v) => {
                            dispatch(updateBill({
                                ...selectedBill,
                                coinsurancePercent: v !== '' && typeof v === 'number' ? v : null,
                            }));
                        }, placeholder: "20", description: "Percentage you pay (e.g., 20 for 20%). Used after deductible is met.", suffix: "%", min: 0, error: validate('coinsurancePercent', selectedBill.coinsurancePercent) })),
                React.createElement(Checkbox, { label: "Counts toward deductible", checked: selectedBill.countsTowardDeductible ?? true, onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            countsTowardDeductible: e.currentTarget.checked,
                        }));
                    }, description: "Usually yes, except for some preventive care or copays" }),
                React.createElement(Checkbox, { label: "Counts toward out-of-pocket maximum", checked: selectedBill.countsTowardOutOfPocket ?? true, onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            countsTowardOutOfPocket: e.currentTarget.checked,
                        }));
                    }, description: "Usually yes for all patient costs" }))),
            React.createElement(Checkbox, { label: "Is this a transfer?", checked: selectedBill.isTransfer, onChange: (event) => {
                    dispatch(updateBill({
                        ...selectedBill,
                        isTransfer: event.currentTarget.checked,
                    }));
                }, error: validate('isTransfer', selectedBill.isTransfer) }),
            selectedBill.isTransfer && (React.createElement(React.Fragment, null,
                React.createElement(Select, { label: "From Account", value: selectedBill.from, data: accountList, searchable: true, placeholder: "Select an account", onChange: (v) => {
                        dispatch(updateBill({ ...selectedBill, from: v }));
                    }, error: validate('from', selectedBill.from) }),
                React.createElement(Select, { label: "To Account", value: selectedBill.to, data: accountList, searchable: true, placeholder: "Select an account", onChange: (v) => {
                        dispatch(updateBill({ ...selectedBill, to: v }));
                    }, error: validate('to', selectedBill.to) }))),
            React.createElement(Group, { w: "100%" },
                !selectedBill.amountIsVariable && (React.createElement(CalculatorEditor, { style: { flex: 1 }, label: "Amount", value: selectedBill.isTransfer ? Math.abs(Number(selectedBill.amount)) : Number(selectedBill.amount), onChange: (v) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            amount: typeof v === 'number' ? v : parseFloat(v),
                        }));
                    }, error: validate('amount', selectedBill.amount) || undefined, handleEnter: handleEnter })),
                selectedBill.amountIsVariable && (React.createElement(Select, { label: "Amount", value: selectedBill.amountVariable, data: amountVariables
                        .map((v) => ({ label: v, value: v }))
                        .concat([
                        { label: '{HALF}', value: '{HALF}' },
                        { label: '{FULL}', value: '{FULL}' },
                        { label: '-{HALF}', value: '-{HALF}' },
                        { label: '-{FULL}', value: '-{FULL}' },
                    ]), onChange: (v) => {
                        if (!v)
                            return;
                        dispatch(updateBill({
                            ...selectedBill,
                            amountVariable: v,
                        }));
                    }, error: validate('amountVariable', selectedBill.amountVariable) })),
                React.createElement(ActionIcon, { mt: (selectedBill.amountIsVariable && !validate('amountVariable', selectedBill.amountVariable)) ||
                        (!selectedBill.amountIsVariable && !validate('amount', selectedBill.amount))
                        ? 22
                        : 2, ml: -12, onClick: () => {
                        dispatch(updateBill({
                            ...selectedBill,
                            amountIsVariable: !selectedBill.amountIsVariable,
                        }));
                    } }, selectedBill.amountIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null))),
            React.createElement(Group, { grow: true, w: "100%" },
                React.createElement(NumberInput, { label: "Every N", value: selectedBill.everyN, onChange: (v) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            everyN: typeof v === 'number' ? v : parseInt(v),
                        }));
                    }, min: 1, error: validate('everyN', selectedBill.everyN), onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            handleEnter();
                        }
                    } }),
                React.createElement(Select, { label: "Periods", value: selectedBill.periods, data: [
                        { value: 'day', label: 'Day' },
                        { value: 'week', label: 'Week' },
                        { value: 'month', label: 'Month' },
                        { value: 'year', label: 'Year' },
                    ], onChange: (v) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            periods: v ? v : '',
                        }));
                    }, searchable: true, error: validate('periods', selectedBill.periods) })),
            React.createElement(Group, { w: "100%" },
                React.createElement(TextInput, { style: { flex: 1 }, label: "Annual start date", value: selectedBill.annualStartDate || '', onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            annualStartDate: e.target.value === '' ? null : e.target.value,
                        }));
                    }, error: validate('annualStartDate', selectedBill.annualStartDate), placeholder: "MM/DD" }),
                React.createElement(TextInput, { style: { flex: 1 }, label: "Annual end date", value: selectedBill.annualEndDate || '', onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            annualEndDate: e.target.value === '' ? null : e.target.value,
                        }));
                    }, placeholder: "MM/DD", error: validate('annualEndDate', selectedBill.annualEndDate) })),
            React.createElement(Group, { w: "100%" },
                React.createElement(Group, { style: { flex: 1 }, w: "100%" },
                    !selectedBill.increaseByIsVariable && (React.createElement(CalculatorEditor, { style: { flex: 1 }, label: "Increase By", value: selectedBill.isTransfer
                            ? Math.abs(Number(selectedBill.increaseBy))
                            : Number(selectedBill.increaseBy), onChange: (v) => {
                            dispatch(updateBill({
                                ...selectedBill,
                                increaseBy: typeof v === 'number' ? v : parseFloat(v),
                            }));
                        }, error: validate('increaseBy', selectedBill.increaseBy) || undefined, handleEnter: handleEnter })),
                    selectedBill.increaseByIsVariable && (React.createElement(Select, { style: { flex: 1 }, label: "Increase By", value: selectedBill.increaseByVariable, data: amountVariables.map((v) => ({
                            label: v,
                            value: v,
                        })), onChange: (v) => {
                            if (!v)
                                return;
                            dispatch(updateBill({
                                ...selectedBill,
                                increaseByVariable: v,
                            }));
                        }, error: validate('increaseByVariable', selectedBill.increaseByVariable) })),
                    React.createElement(ActionIcon, { mt: (selectedBill.increaseByIsVariable &&
                            !validate('increaseByVariable', selectedBill.increaseByVariable)) ||
                            (!selectedBill.increaseByIsVariable && !validate('increaseBy', selectedBill.increaseBy))
                            ? 22
                            : 2, ml: -12, onClick: () => {
                            dispatch(updateBill({
                                ...selectedBill,
                                increaseByIsVariable: !selectedBill.increaseByIsVariable,
                            }));
                        } }, selectedBill.increaseByIsVariable ? React.createElement(IconVariable, null) : React.createElement(IconVariableOff, null))),
                React.createElement(TextInput, { style: { flex: 1 }, label: "Increase By Date", value: selectedBill.increaseByDate, onChange: (e) => {
                        dispatch(updateBill({
                            ...selectedBill,
                            increaseByDate: e.target.value,
                        }));
                    }, error: validate('increaseByDate', selectedBill.increaseByDate), placeholder: "MM/DD" })),
            React.createElement(Group, { w: "100%" },
                React.createElement(FlagSelect, { flagColor: selectedBill.flagColor, onChange: (v) => {
                        dispatch(updateBill({ ...selectedBill, flagColor: v.flagColor, flag: v.flag }));
                    } })),
            React.createElement(Group, { w: "100%", grow: true },
                React.createElement(Button, { disabled: !allValid(), onClick: () => {
                        dispatch(saveBill(account, selectedBill, startDate, endDate, graphStartDate, graphEndDate));
                        resetSelected();
                    } }, "Save"),
                React.createElement(Button, { disabled: !selectedBill.id, onClick: () => {
                        dispatch(removeBill(account, billId, selectedBill.isTransfer, startDate, endDate, graphStartDate, graphEndDate));
                        resetSelected();
                    } }, "Remove")))) : (React.createElement(Text, null, "No bill selected"))));
};
