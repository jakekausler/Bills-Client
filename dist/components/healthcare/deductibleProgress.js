import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Stack, Progress, Text, Group, Loader, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { getDeductibleProgress } from '../../features/healthcare/api';
import { selectHealthcareConfigs } from '../../features/healthcare/select';
export default function DeductibleProgress() {
    const selectedSimulation = useSelector((state) => state.simulations.simulations.find((s) => s.selected)?.name || 'Default');
    const configs = useSelector(selectHealthcareConfigs);
    const [progressData, setProgressData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchProgress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getDeductibleProgress(selectedSimulation);
            setProgressData(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load progress');
        }
        finally {
            setLoading(false);
        }
    }, [selectedSimulation]);
    useEffect(() => {
        fetchProgress();
    }, [fetchProgress, configs]);
    const getColor = (spent, total) => {
        const percent = (spent / total) * 100;
        if (percent < 25)
            return 'red';
        if (percent < 75)
            return 'yellow';
        return 'green';
    };
    const getPercent = (spent, total) => {
        if (total === 0)
            return '0';
        return ((spent / total) * 100).toFixed(1);
    };
    if (loading) {
        return (React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Group, { justify: "center", py: "xl" },
                React.createElement(Loader, { size: "sm" }),
                React.createElement(Text, { c: "dimmed" }, "Loading deductible progress..."))));
    }
    const handleRetry = () => {
        fetchProgress();
    };
    if (error) {
        return (React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Alert, { icon: React.createElement(IconAlertCircle, { size: 16 }), title: "Error", color: "red", withCloseButton: true, onClose: () => setError(null) },
                error,
                React.createElement(Group, { mt: "md" },
                    React.createElement(Button, { size: "xs", leftSection: React.createElement(IconRefresh, { size: 14 }), onClick: handleRetry, variant: "light" }, "Retry")))));
    }
    const people = Object.keys(progressData);
    if (people.length === 0) {
        return (React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Text, { c: "dimmed", ta: "center", py: "xl" }, "No active healthcare configurations with expenses found.")));
    }
    return (React.createElement(Card, { shadow: "sm", p: "lg" },
        React.createElement(Title, { order: 3, mb: "md" },
            "Deductible Progress - ",
            progressData[people[0]]?.planYear),
        React.createElement(Stack, { gap: "lg" }, people.map((person) => {
            const progress = progressData[person];
            return (React.createElement(Card, { key: person, withBorder: true, p: "md" },
                React.createElement(Text, { fw: 700, mb: "sm" },
                    person,
                    " - ",
                    progress.configName),
                React.createElement(Stack, { gap: "sm" },
                    React.createElement("div", null,
                        React.createElement(Group, { justify: "space-between", mb: 4 },
                            React.createElement(Text, { size: "sm" }, "Individual Deductible"),
                            React.createElement(Text, { size: "sm", fw: 500 },
                                "$",
                                progress.individualDeductibleSpent,
                                " / $",
                                progress.individualDeductibleSpent + progress.individualDeductibleRemaining,
                                ' ',
                                "(",
                                getPercent(progress.individualDeductibleSpent, progress.individualDeductibleSpent + progress.individualDeductibleRemaining),
                                "%)",
                                progress.individualDeductibleMet && ' ✓')),
                        React.createElement(Progress, { value: (progress.individualDeductibleSpent /
                                (progress.individualDeductibleSpent +
                                    progress.individualDeductibleRemaining)) *
                                100, color: getColor(progress.individualDeductibleSpent, progress.individualDeductibleSpent + progress.individualDeductibleRemaining), size: "lg" })),
                    React.createElement("div", null,
                        React.createElement(Group, { justify: "space-between", mb: 4 },
                            React.createElement(Text, { size: "sm" }, "Family Deductible"),
                            React.createElement(Text, { size: "sm", fw: 500 },
                                "$",
                                progress.familyDeductibleSpent,
                                " / $",
                                progress.familyDeductibleSpent + progress.familyDeductibleRemaining,
                                ' ',
                                "(",
                                getPercent(progress.familyDeductibleSpent, progress.familyDeductibleSpent + progress.familyDeductibleRemaining),
                                "%)",
                                progress.familyDeductibleMet && ' ✓')),
                        React.createElement(Progress, { value: (progress.familyDeductibleSpent /
                                (progress.familyDeductibleSpent + progress.familyDeductibleRemaining)) *
                                100, color: getColor(progress.familyDeductibleSpent, progress.familyDeductibleSpent + progress.familyDeductibleRemaining), size: "lg" })),
                    React.createElement("div", null,
                        React.createElement(Group, { justify: "space-between", mb: 4 },
                            React.createElement(Text, { size: "sm" }, "Individual Out-of-Pocket Max"),
                            React.createElement(Text, { size: "sm", fw: 500 },
                                "$",
                                progress.individualOOPSpent,
                                " / $",
                                progress.individualOOPSpent + progress.individualOOPRemaining,
                                ' ',
                                "(",
                                getPercent(progress.individualOOPSpent, progress.individualOOPSpent + progress.individualOOPRemaining),
                                "%)",
                                progress.individualOOPMet && ' ✓')),
                        React.createElement(Progress, { value: (progress.individualOOPSpent /
                                (progress.individualOOPSpent + progress.individualOOPRemaining)) *
                                100, color: getColor(progress.individualOOPSpent, progress.individualOOPSpent + progress.individualOOPRemaining), size: "lg" })),
                    React.createElement("div", null,
                        React.createElement(Group, { justify: "space-between", mb: 4 },
                            React.createElement(Text, { size: "sm" }, "Family Out-of-Pocket Max"),
                            React.createElement(Text, { size: "sm", fw: 500 },
                                "$",
                                progress.familyOOPSpent,
                                " / $",
                                progress.familyOOPSpent + progress.familyOOPRemaining,
                                ' ',
                                "(",
                                getPercent(progress.familyOOPSpent, progress.familyOOPSpent + progress.familyOOPRemaining),
                                "%)",
                                progress.familyOOPMet && ' ✓')),
                        React.createElement(Progress, { value: (progress.familyOOPSpent /
                                (progress.familyOOPSpent + progress.familyOOPRemaining)) *
                                100, color: getColor(progress.familyOOPSpent, progress.familyOOPSpent + progress.familyOOPRemaining), size: "lg" })))));
        }))));
}
