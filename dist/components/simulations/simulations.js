import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSimulations, selectSimulationsLoaded } from '../../features/simulations/select';
import { ActionIcon, Checkbox, LoadingOverlay, Radio, Stack, Table, Text, TextInput } from '@mantine/core';
import { loadSimulations, saveSimulations } from '../../features/simulations/actions';
import { useEffect, useState } from 'react';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
export default function Simulations() {
    const simulations = useSelector(selectSimulations);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadSimulations());
    }, [dispatch]);
    const simulationsLoaded = useSelector(selectSimulationsLoaded);
    const [simulationNames, setSimulationNames] = useState(simulations.map((s) => s.name));
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const isLoading = !simulationsLoaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 250);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [simulationsLoaded]);
    return (React.createElement(Stack, { h: "100%", w: "100%", pos: "relative" },
        React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
        React.createElement(Radio.Group, { value: simulations.find((s) => s.selected)?.name, onChange: (value) => {
                dispatch(saveSimulations(simulations.map((s) => ({ ...s, selected: s.name === value }))));
            } },
            React.createElement(Table, null,
                React.createElement(Table.Thead, null,
                    React.createElement(Table.Tr, null,
                        React.createElement(Table.Th, null, "Name"),
                        React.createElement(Table.Th, null,
                            React.createElement(IconEye, null)),
                        React.createElement(Table.Th, null,
                            React.createElement(IconEdit, null)),
                        React.createElement(Table.Th, null,
                            React.createElement(ActionIcon, { onClick: () => {
                                    setSimulationNames([...simulationNames, `Simulation ${simulations.length + 1}`]);
                                    dispatch(saveSimulations([
                                        ...simulations,
                                        {
                                            name: `Simulation ${simulations.length + 1}`,
                                            enabled: true,
                                            selected: false,
                                            variables: simulations.find((s) => s.name === 'Default')?.variables ?? {},
                                        },
                                    ]));
                                } },
                                React.createElement(IconPlus, null))))),
                React.createElement(Table.Tbody, null, simulations.map((simulation, index) => (React.createElement(Table.Tr, { key: simulation.name },
                    React.createElement(Table.Td, null,
                        simulation.name === 'Default' && React.createElement(Text, null, simulation.name),
                        simulation.name !== 'Default' && (React.createElement(TextInput, { value: simulationNames[index], onChange: (e) => {
                                setSimulationNames(simulationNames.map((n, i) => (i === index ? e.target.value : n)));
                            }, onBlur: () => {
                                dispatch(saveSimulations(simulations.map((s, i) => ({ ...s, name: simulationNames[i] }))));
                            } }))),
                    React.createElement(Table.Td, null,
                        React.createElement(Checkbox, { checked: simulation.enabled, onChange: () => dispatch(saveSimulations(simulations.map((s) => (s.name === simulation.name ? { ...s, enabled: !s.enabled } : s)))) })),
                    React.createElement(Table.Td, null,
                        React.createElement(Radio, { value: simulation.name })),
                    React.createElement(Table.Td, null,
                        React.createElement(ActionIcon, { onClick: () => {
                                dispatch(saveSimulations(simulations
                                    .filter((s) => s.name !== simulation.name)
                                    // Ensure that the default simulation is selected if the deleted simulation is selected
                                    .map((s) => ({
                                    ...s,
                                    selected: simulation.selected && s.name === 'Default' ? true : s.selected,
                                }))));
                                setSimulationNames(simulationNames.filter((n) => n !== simulation.name));
                            }, disabled: simulation.name === 'Default' },
                            React.createElement(IconTrash, null)))))))))));
}
