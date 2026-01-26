import React, { useState } from 'react';
import { Card, Title, Table, Button, Group, ActionIcon, Text, Loader, Alert, } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectHealthcareConfigs, selectHealthcareLoading } from '../../features/healthcare/select';
import { deleteHealthcareConfig } from '../../features/healthcare/actions';
import ConfigForm from './configForm';
export default function ConfigList() {
    const dispatch = useDispatch();
    const configs = useSelector(selectHealthcareConfigs);
    const loading = useSelector(selectHealthcareLoading);
    const [formOpened, setFormOpened] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [error, setError] = useState(null);
    const handleAdd = () => {
        setEditingConfig(null);
        setFormOpened(true);
    };
    const handleEdit = (config) => {
        setEditingConfig(config);
        setFormOpened(true);
    };
    const handleDelete = async (config) => {
        if (window.confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
            try {
                setError(null);
                await dispatch(deleteHealthcareConfig(config.id));
            }
            catch (err) {
                console.error('Failed to delete config:', err);
                setError(err instanceof Error
                    ? err.message
                    : `Failed to delete healthcare configuration "${config.name}". Please try again.`);
            }
        }
    };
    const handleFormClose = () => {
        setFormOpened(false);
        setEditingConfig(null);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Card, { shadow: "sm", p: "lg" },
            React.createElement(Group, { justify: "space-between", mb: "md" },
                React.createElement(Title, { order: 3 }, "Healthcare Configurations"),
                React.createElement(Button, { leftSection: React.createElement(IconPlus, { size: 16 }), onClick: handleAdd }, "Add Config")),
            error && (React.createElement(Alert, { icon: React.createElement(IconAlertCircle, { size: 16 }), title: "Error", color: "red", mb: "md", withCloseButton: true, onClose: () => setError(null) }, error)),
            loading ? (React.createElement(Group, { justify: "center", py: "xl" },
                React.createElement(Loader, { size: "sm" }),
                React.createElement(Text, { c: "dimmed" }, "Loading healthcare configurations..."))) : configs.length === 0 ? (React.createElement(Text, { c: "dimmed", ta: "center", py: "xl" }, "No healthcare configurations yet. Click \"Add Config\" to create one.")) : (React.createElement(Table, null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Person"),
                        React.createElement("th", null, "Plan Name"),
                        React.createElement("th", null, "Start Date"),
                        React.createElement("th", null, "End Date"),
                        React.createElement("th", null, "Deductible (Ind/Fam)"),
                        React.createElement("th", null, "OOP Max (Ind/Fam)"),
                        React.createElement("th", null, "HSA"),
                        React.createElement("th", null, "Actions"))),
                React.createElement("tbody", null, configs.map((config) => (React.createElement("tr", { key: config.id },
                    React.createElement("td", null, config.personName),
                    React.createElement("td", null, config.name),
                    React.createElement("td", null, config.startDate),
                    React.createElement("td", null, config.endDate || 'Ongoing'),
                    React.createElement("td", null,
                        "$",
                        config.individualDeductible,
                        " / $",
                        config.familyDeductible),
                    React.createElement("td", null,
                        "$",
                        config.individualOutOfPocketMax,
                        " / $",
                        config.familyOutOfPocketMax),
                    React.createElement("td", null, config.hsaReimbursementEnabled ? 'Enabled' : 'Disabled'),
                    React.createElement("td", null,
                        React.createElement(Group, { gap: "xs" },
                            React.createElement(ActionIcon, { color: "blue", onClick: () => handleEdit(config) },
                                React.createElement(IconEdit, { size: 16 })),
                            React.createElement(ActionIcon, { color: "red", onClick: () => handleDelete(config) },
                                React.createElement(IconTrash, { size: 16 }))))))))))),
        React.createElement(ConfigForm, { opened: formOpened, onClose: handleFormClose, config: editingConfig })));
}
