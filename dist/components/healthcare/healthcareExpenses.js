import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Table, Select, Group, Text, Loader, Alert, Badge, Stack, Button, } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { getHealthcareExpenses } from '../../features/healthcare/api';
export default function HealthcareExpenses() {
    const selectedSimulation = useSelector((state) => state.simulations.simulations.find((s) => s.selected)?.name || 'Default');
    const configs = useSelector((state) => state.healthcare.configs);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterPerson, setFilterPerson] = useState(null);
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const startDateStr = filterStartDate?.toISOString().split('T')[0];
            const endDateStr = filterEndDate?.toISOString().split('T')[0];
            const data = await getHealthcareExpenses(selectedSimulation, startDateStr, endDateStr);
            setExpenses(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load expenses');
        }
        finally {
            setLoading(false);
        }
    }, [selectedSimulation, filterStartDate, filterEndDate]);
    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);
    const uniquePeople = [...new Set(expenses.map((e) => e.person))];
    const peopleOptions = uniquePeople.map((p) => ({ value: p, label: p }));
    const filteredExpenses = filterPerson
        ? expenses.filter((e) => e.person === filterPerson)
        : expenses;
    if (loading) {
        return (React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Group, { justify: "center", py: "xl" },
                React.createElement(Loader, { size: "sm" }),
                React.createElement(Text, { c: "dimmed" }, "Loading healthcare expenses..."))));
    }
    const handleRetry = () => {
        fetchExpenses();
    };
    if (error) {
        return (React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Alert, { icon: React.createElement(IconAlertCircle, { size: 16 }), title: "Error", color: "red", withCloseButton: true, onClose: () => setError(null) },
                error,
                React.createElement(Group, { mt: "md" },
                    React.createElement(Button, { size: "xs", leftSection: React.createElement(IconRefresh, { size: 14 }), onClick: handleRetry, variant: "light" }, "Retry")))));
    }
    return (React.createElement(Card, { shadow: "sm", p: "lg" },
        React.createElement(Stack, { gap: "md" },
            React.createElement(Group, { justify: "space-between" },
                React.createElement(Title, { order: 3 }, "Healthcare Expenses"),
                React.createElement(Group, null,
                    React.createElement(Select, { placeholder: "Filter by person", data: peopleOptions, value: filterPerson, onChange: setFilterPerson, clearable: true, searchable: true, style: { width: 150 } }),
                    React.createElement(DateInput, { placeholder: "Start date", value: filterStartDate, onChange: setFilterStartDate, clearable: true, style: { width: 150 } }),
                    React.createElement(DateInput, { placeholder: "End date", value: filterEndDate, onChange: setFilterEndDate, clearable: true, style: { width: 150 } }))),
            filteredExpenses.length === 0 ? (React.createElement(Text, { c: "dimmed", ta: "center", py: "xl" }, "No healthcare expenses found for this period.")) : (React.createElement(Table, null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Date"),
                        React.createElement("th", null, "Name"),
                        React.createElement("th", null, "Person"),
                        React.createElement("th", null, "Bill Amount"),
                        React.createElement("th", null, "Patient Cost"),
                        React.createElement("th", null, "Copay"),
                        React.createElement("th", null, "Coinsurance"),
                        React.createElement("th", null, "HSA Reimbursed"),
                        React.createElement("th", null, "Account"))),
                React.createElement("tbody", null, filteredExpenses.map((expense) => (React.createElement("tr", { key: expense.id, style: {
                        backgroundColor: expense.hsaReimbursed > 0 ? '#e7f5ff' : undefined,
                    } },
                    React.createElement("td", null, expense.date),
                    React.createElement("td", null,
                        expense.name,
                        expense.patientCost === 0 && (React.createElement(Badge, { size: "xs", color: "green", ml: "xs" }, "Fully Covered"))),
                    React.createElement("td", null, expense.person),
                    React.createElement("td", null,
                        "$",
                        expense.billAmount.toFixed(2)),
                    React.createElement("td", null,
                        "$",
                        expense.patientCost.toFixed(2)),
                    React.createElement("td", null, expense.copay ? `$${expense.copay.toFixed(2)}` : '-'),
                    React.createElement("td", null, expense.coinsurance ? `${expense.coinsurance}%` : '-'),
                    React.createElement("td", null, expense.hsaReimbursed > 0 ? `$${expense.hsaReimbursed.toFixed(2)}` : '-'),
                    React.createElement("td", null, expense.accountName))))))),
            React.createElement(Text, { size: "xs", c: "dimmed", ta: "right" },
                "Showing ",
                filteredExpenses.length,
                " expense",
                filteredExpenses.length !== 1 ? 's' : ''))));
}
