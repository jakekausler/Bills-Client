import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, LoadingOverlay, Stack, Table, Text, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { CheckboxIcon } from '../helpers/checkboxIcon';
import { selectSimulations, selectSimulationsLoaded } from '../../features/simulations/select';
export default function SimulationSelector({ selectedSimulations, updateSelectedSimulations, }) {
    const simulations = useSelector(selectSimulations);
    const simulationsLoaded = useSelector(selectSimulationsLoaded);
    const dispatch = useDispatch();
    const [showLoading, setShowLoading] = useState(false);
    const theme = useMantineTheme();
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
        React.createElement(Table, { verticalSpacing: 0, withRowBorders: false },
            React.createElement(Table.Thead, null,
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Th, null, "Simulation"))),
            React.createElement(Table.Tbody, null,
                React.createElement(Table.Tr, null,
                    React.createElement(Table.Td, null,
                        React.createElement(Text, { size: "xs", fw: 500 }, "Select All")),
                    React.createElement(Table.Td, null,
                        React.createElement(CheckboxIcon, { checked: selectedSimulations.length === simulations.length, onChange: () => dispatch(updateSelectedSimulations(selectedSimulations.length === simulations.length ? [] : simulations.map((s) => s.name))), checkedIcon: React.createElement(IconEye, { stroke: 1.5, color: theme.colors.orange[6], size: 16 }), uncheckedIcon: React.createElement(IconEyeOff, { stroke: 1.5, color: theme.colors.orange[6], size: 16 }) }))),
                simulations.map((simulation) => (React.createElement(React.Fragment, { key: simulation.name },
                    React.createElement(Table.Tr, null,
                        React.createElement(Table.Td, null,
                            React.createElement(Box, { h: 8 }))),
                    React.createElement(Table.Tr, null,
                        React.createElement(Table.Td, null,
                            React.createElement(Text, { size: "xs", fw: 500 }, simulation.name)),
                        React.createElement(Table.Td, null,
                            React.createElement(CheckboxIcon, { checked: selectedSimulations.includes(simulation.name), onChange: () => dispatch(updateSelectedSimulations(selectedSimulations.includes(simulation.name)
                                    ? selectedSimulations.filter((s) => s !== simulation.name)
                                    : [...selectedSimulations, simulation.name])), checkedIcon: React.createElement(IconEye, { stroke: 1.5, color: theme.colors.blue[6], size: 16 }), uncheckedIcon: React.createElement(IconEyeOff, { stroke: 1.5, color: theme.colors.blue[6], size: 16 }) }))))))))));
}
