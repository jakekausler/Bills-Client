import React, { useState, useEffect } from 'react';
import { Modal, TextInput, NumberInput, Select, Checkbox, Button, Group, Tabs, Stack, Text, Alert, } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconAlertCircle } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { createHealthcareConfig, updateHealthcareConfig } from '../../features/healthcare/actions';
const MONTHS = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
];
export default function ConfigForm({ opened, onClose, config }) {
    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.accounts.accounts);
    const isEdit = config !== null;
    const [name, setName] = useState('');
    const [personName, setPersonName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [individualDeductible, setIndividualDeductible] = useState('');
    const [individualOutOfPocketMax, setIndividualOutOfPocketMax] = useState('');
    const [familyDeductible, setFamilyDeductible] = useState('');
    const [familyOutOfPocketMax, setFamilyOutOfPocketMax] = useState('');
    const [hsaAccountId, setHsaAccountId] = useState(null);
    const [hsaReimbursementEnabled, setHsaReimbursementEnabled] = useState(true);
    const [resetMonth, setResetMonth] = useState('0');
    const [resetDay, setResetDay] = useState(1);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (config) {
            setName(config.name);
            setPersonName(config.personName);
            setStartDate(new Date(config.startDate));
            setEndDate(config.endDate ? new Date(config.endDate) : null);
            setIndividualDeductible(config.individualDeductible);
            setIndividualOutOfPocketMax(config.individualOutOfPocketMax);
            setFamilyDeductible(config.familyDeductible);
            setFamilyOutOfPocketMax(config.familyOutOfPocketMax);
            setHsaAccountId(config.hsaAccountId);
            setHsaReimbursementEnabled(config.hsaReimbursementEnabled);
            setResetMonth(config.resetMonth.toString());
            setResetDay(config.resetDay);
        }
        else {
            resetForm();
        }
    }, [config, opened]);
    const resetForm = () => {
        setName('');
        setPersonName('');
        setStartDate(null);
        setEndDate(null);
        setIndividualDeductible('');
        setIndividualOutOfPocketMax('');
        setFamilyDeductible('');
        setFamilyOutOfPocketMax('');
        setHsaAccountId(null);
        setHsaReimbursementEnabled(true);
        setResetMonth('0');
        setResetDay(1);
        setError(null);
    };
    const handleSave = async () => {
        if (!startDate || !name || !personName)
            return;
        // Clear any previous errors
        setError(null);
        const configData = {
            name,
            personName,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate ? endDate.toISOString().split('T')[0] : null,
            individualDeductible: Number(individualDeductible),
            individualOutOfPocketMax: Number(individualOutOfPocketMax),
            familyDeductible: Number(familyDeductible),
            familyOutOfPocketMax: Number(familyOutOfPocketMax),
            hsaAccountId,
            hsaReimbursementEnabled,
            resetMonth: Number(resetMonth),
            resetDay: Number(resetDay),
        };
        try {
            if (isEdit && config) {
                await dispatch(updateHealthcareConfig(config.id, { ...configData, id: config.id }));
            }
            else {
                await dispatch(createHealthcareConfig(configData));
            }
            onClose();
        }
        catch (error) {
            console.error('Failed to save config:', error);
            setError(error instanceof Error
                ? error.message
                : `Failed to ${isEdit ? 'update' : 'create'} healthcare configuration. Please try again.`);
        }
    };
    const hsaAccounts = accounts
        .filter((a) => a.type === 'HSA')
        .map((a) => ({ value: a.id, label: a.name }));
    return (React.createElement(Modal, { opened: opened, onClose: onClose, title: isEdit ? 'Edit Healthcare Configuration' : 'New Healthcare Configuration', size: "lg" },
        error && (React.createElement(Alert, { icon: React.createElement(IconAlertCircle, { size: 16 }), title: "Error", color: "red", mb: "md", withCloseButton: true, onClose: () => setError(null) }, error)),
        React.createElement(Tabs, { defaultValue: "basic" },
            React.createElement(Tabs.List, null,
                React.createElement(Tabs.Tab, { value: "basic" }, "Basic Info"),
                React.createElement(Tabs.Tab, { value: "thresholds" }, "Deductibles & OOP"),
                React.createElement(Tabs.Tab, { value: "hsa" }, "HSA Settings"),
                React.createElement(Tabs.Tab, { value: "reset" }, "Plan Year Reset")),
            React.createElement(Tabs.Panel, { value: "basic", pt: "md" },
                React.createElement(Stack, { gap: "sm" },
                    React.createElement(TextInput, { label: "Plan Name", placeholder: "e.g., Blue Cross PPO 2024", value: name, onChange: (e) => setName(e.target.value), required: true }),
                    React.createElement(TextInput, { label: "Person Name", placeholder: "e.g., John, Jane", value: personName, onChange: (e) => setPersonName(e.target.value), required: true }),
                    React.createElement(DateInput, { label: "Start Date", placeholder: "When does this plan start?", value: startDate, onChange: setStartDate, required: true }),
                    React.createElement(DateInput, { label: "End Date", placeholder: "Leave empty if ongoing", value: endDate, onChange: setEndDate, clearable: true }))),
            React.createElement(Tabs.Panel, { value: "thresholds", pt: "md" },
                React.createElement(Stack, { gap: "sm" },
                    React.createElement(NumberInput, { label: "Individual Deductible", placeholder: "e.g., 1500", value: individualDeductible, onChange: (val) => setIndividualDeductible(val === '' ? '' : Number(val)), prefix: "$", min: 0, required: true }),
                    React.createElement(NumberInput, { label: "Family Deductible", placeholder: "e.g., 3000", value: familyDeductible, onChange: (val) => setFamilyDeductible(val === '' ? '' : Number(val)), prefix: "$", min: 0, required: true }),
                    React.createElement(NumberInput, { label: "Individual Out-of-Pocket Max", placeholder: "e.g., 5000", value: individualOutOfPocketMax, onChange: (val) => setIndividualOutOfPocketMax(val === '' ? '' : Number(val)), prefix: "$", min: 0, required: true }),
                    React.createElement(NumberInput, { label: "Family Out-of-Pocket Max", placeholder: "e.g., 10000", value: familyOutOfPocketMax, onChange: (val) => setFamilyOutOfPocketMax(val === '' ? '' : Number(val)), prefix: "$", min: 0, required: true }))),
            React.createElement(Tabs.Panel, { value: "hsa", pt: "md" },
                React.createElement(Stack, { gap: "sm" },
                    React.createElement(Select, { label: "HSA Account", placeholder: "Select HSA account for reimbursements", data: hsaAccounts, value: hsaAccountId, onChange: setHsaAccountId, clearable: true, searchable: true }),
                    React.createElement(Checkbox, { label: "Enable automatic HSA reimbursement", checked: hsaReimbursementEnabled, onChange: (e) => setHsaReimbursementEnabled(e.currentTarget.checked), description: "Automatically reimburse healthcare expenses from HSA" }),
                    hsaAccounts.length === 0 && (React.createElement(Text, { size: "sm", c: "dimmed" }, "No HSA accounts found. Create an HSA account first.")))),
            React.createElement(Tabs.Panel, { value: "reset", pt: "md" },
                React.createElement(Stack, { gap: "sm" },
                    React.createElement(Select, { label: "Reset Month", placeholder: "Select month", data: MONTHS, value: resetMonth, onChange: (val) => setResetMonth(val || '0'), required: true }),
                    React.createElement(NumberInput, { label: "Reset Day", placeholder: "e.g., 1", value: resetDay, onChange: (val) => setResetDay(val === '' ? '' : Number(val)), min: 1, max: 31, required: true }),
                    React.createElement(Text, { size: "sm", c: "dimmed" }, "When your deductible and out-of-pocket maximum reset each year")))),
        React.createElement(Group, { justify: "flex-end", mt: "xl" },
            React.createElement(Button, { variant: "outline", onClick: onClose }, "Cancel"),
            React.createElement(Button, { onClick: handleSave, disabled: !name || !personName || !startDate }, isEdit ? 'Update' : 'Create'))));
}
