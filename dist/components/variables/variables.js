import React from 'react';
import { ActionIcon, Button, LoadingOverlay, NumberInput, Stack, Table, Text, TextInput } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedSimulation, selectSimulations, selectUsedVariables, selectUsedVariablesLoaded, } from '../../features/simulations/select';
import { saveSimulations } from '../../features/simulations/actions';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ConditionalTooltip } from '../helpers/conditionalTooltip';
import { toDateString } from '../../utils/date';
import { EditableDateInput } from '../helpers/editableDateInput';
function UsedVariableTooltip({ used }) {
    return (React.createElement(Stack, null,
        React.createElement(Text, null, "This variable is in use."),
        React.createElement(Table, null,
            React.createElement(Table.Thead, null,
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Th, null, "Name"),
                    React.createElement(Table.Th, null, "Account"),
                    used.some((u) => !!u.date) && React.createElement(Table.Th, null, "Date"))),
            React.createElement(Table.Tbody, null, used.map((u, idx) => {
                return (React.createElement(Table.Tr, { key: idx },
                    React.createElement(Table.Td, null, u.name),
                    React.createElement(Table.Td, null, u.account || u.from || 'unknown'),
                    !!u.date && React.createElement(Table.Td, null, new Date(u.date).toLocaleDateString())));
            })))));
}
export default function Variables() {
    const dispatch = useDispatch();
    const simulation = useSelector(selectSelectedSimulation);
    const simulations = useSelector(selectSimulations);
    const [variableNames, setVariableNames] = useState(simulation?.variables ? Object.keys(simulation.variables) : []);
    const [variableValues, setVariableValues] = useState(simulation?.variables ? Object.values(simulation.variables).map((v) => v.value) : []);
    const usedVariables = useSelector(selectUsedVariables);
    const variablesLoaded = useSelector(selectUsedVariablesLoaded);
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const isLoading = !variablesLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [variablesLoaded]);
    useEffect(() => {
        if (!simulation) {
            return;
        }
        setVariableNames(Object.keys(simulation.variables));
        setVariableValues(Object.values(simulation.variables).map((v) => v.value));
    }, [simulation]);
    if (!simulation) {
        return null;
    }
    const name = simulation.name;
    const variables = simulation.variables;
    return (React.createElement(Stack, { h: "100%", w: "100%", pos: "relative" },
        React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
        React.createElement("h2", null,
            name,
            " Variables"),
        React.createElement(Table, null,
            React.createElement(Table.Tbody, null,
                Object.entries(variables).map(([variable, value], idx) => {
                    return (React.createElement(ConditionalTooltip, { label: React.createElement(UsedVariableTooltip, { used: usedVariables[variable] }), condition: usedVariables[variable]?.length > 0, key: variable },
                        React.createElement(Table.Tr, { w: "100%" },
                            React.createElement(Table.Td, null,
                                React.createElement(TextInput, { disabled: usedVariables[variable]?.length > 0, style: { flex: 1 }, label: "Name", value: variableNames[idx], onBlur: () => {
                                        if (variableNames[idx] === '' ||
                                            variableNames[idx] === undefined ||
                                            variableNames[idx] === null)
                                            return;
                                        setVariableNames(variableNames.map((name, i) => (i === idx ? variable : name)));
                                        if (variableNames[idx] !== variable) {
                                            dispatch(saveSimulations(simulations.map((s) => {
                                                const updatedSimulation = {
                                                    ...s,
                                                    variables: {
                                                        ...s.variables,
                                                        [variableNames[idx]]: s.variables[variable],
                                                    },
                                                };
                                                delete updatedSimulation.variables[variable];
                                                return updatedSimulation;
                                            })));
                                        }
                                    }, onChange: (event) => {
                                        setVariableNames(variableNames.map((n, i) => (i === idx ? event.target.value : n)));
                                    } })),
                            React.createElement(Table.Td, null,
                                value.type === 'amount' && (React.createElement(NumberInput, { style: { flex: 1 }, label: "Value", value: variableValues[idx], onChange: (amount) => {
                                        setVariableValues(variableValues.map((v, i) => (i === idx ? amount : v)));
                                    }, onBlur: (event) => {
                                        setVariableValues(variableValues.map((v, i) => i === idx
                                            ? typeof event.target.value === 'number'
                                                ? event.target.value
                                                : parseFloat(event.target.value)
                                            : v));
                                        if (variableValues[idx] !== value.value) {
                                            dispatch(saveSimulations(simulations.map((s) => ({
                                                ...s,
                                                variables: {
                                                    ...s.variables,
                                                    ...(s.selected
                                                        ? {
                                                            [variable]: {
                                                                ...s.variables[variable],
                                                                value: typeof event.target.value === 'number'
                                                                    ? event.target.value
                                                                    : parseFloat(event.target.value),
                                                            },
                                                        }
                                                        : {}),
                                                },
                                            }))));
                                        }
                                    } })),
                                value.type === 'date' && (React.createElement(EditableDateInput, { label: "Value", value: value.value, onBlur: (date) => {
                                        if (!date) {
                                            return;
                                        }
                                        if (date !== value.value) {
                                            dispatch(saveSimulations(simulations.map((s) => ({
                                                ...s,
                                                variables: {
                                                    ...s.variables,
                                                    ...(s.selected
                                                        ? {
                                                            [variable]: {
                                                                ...s.variables[variable],
                                                                value: date,
                                                            },
                                                        }
                                                        : {}),
                                                },
                                            }))));
                                        }
                                    }, placeholder: "Select date" }))),
                            React.createElement(Table.Td, { style: { position: 'relative' } },
                                React.createElement(ActionIcon, { style: { bottom: 'px', position: 'absolute' }, size: "34px", disabled: usedVariables[variable]?.length > 0, onClick: () => dispatch(saveSimulations(simulations.map((s) => {
                                        const updatedSimulation = {
                                            ...s,
                                            variables: {
                                                ...s.variables,
                                            },
                                        };
                                        delete updatedSimulation.variables[variable];
                                        return updatedSimulation;
                                    }))) },
                                    React.createElement(IconX, null))))));
                }),
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Td, null,
                        React.createElement(Button, { w: "100%", onClick: () => dispatch(saveSimulations(simulations.map((s) => ({
                                ...s,
                                variables: {
                                    ...s.variables,
                                    [`Variable ${Object.keys(s.variables).length}`]: {
                                        type: 'amount',
                                        value: 0,
                                    },
                                },
                            })))) }, "Add Amount")),
                    React.createElement(Table.Td, null,
                        React.createElement(Button, { w: "100%", onClick: () => dispatch(saveSimulations(simulations.map((s) => ({
                                ...s,
                                variables: {
                                    ...s.variables,
                                    [`Variable ${Object.keys(s.variables).length}`]: {
                                        type: 'date',
                                        value: toDateString(new Date()),
                                    },
                                },
                            })))) }, "Add Date")))))));
}
