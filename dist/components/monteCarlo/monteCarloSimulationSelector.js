import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text, Stack, Badge, Progress, LoadingOverlay, Group, Paper, Tooltip, } from '@mantine/core';
import { selectSimulations, selectSimulationsLoaded, } from '../../features/monteCarlo/select';
import { loadAllSimulations, updateSimulationProgress, loadSimulationGraph, } from '../../features/monteCarlo/actions';
import { IconChartLine, IconRefresh } from '@tabler/icons-react';
export default function MonteCarloSimulationSelector({ close }) {
    const dispatch = useDispatch();
    const simulations = useSelector(selectSimulations);
    const simulationsLoaded = useSelector(selectSimulationsLoaded);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [, setCurrentTime] = React.useState(Date.now()); // Force re-renders for age updates
    useEffect(() => {
        dispatch(loadAllSimulations());
    }, [dispatch]);
    useEffect(() => {
        const interval = setInterval(() => {
            simulations
                .filter(sim => sim.status === 'running' || sim.status === 'pending')
                .forEach(sim => {
                dispatch(updateSimulationProgress(sim.id));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [simulations, dispatch]);
    // Update the component every second to refresh age displays
    useEffect(() => {
        const ageInterval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(ageInterval);
    }, []);
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(loadAllSimulations());
        }
        catch (err) {
            console.error('Failed to refresh simulations', err);
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const handleViewGraph = async (simulationId) => {
        try {
            await dispatch(loadSimulationGraph(simulationId));
            close(); // Close sidebar on mobile after selecting
        }
        catch (err) {
            console.error('Failed to load graph', err);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'green';
            case 'running':
                return 'blue';
            case 'pending':
                return 'yellow';
            case 'error':
                return 'red';
            default:
                return 'gray';
        }
    };
    const formatDuration = (duration, startedAt, completedAt) => {
        // Use the provided duration if available
        if (duration !== undefined) {
            const diffSec = duration / 1000;
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin > 0) {
                return `${diffMin}m ${Math.floor(diffSec % 60)}s`;
            }
            return `${Math.round(diffSec * 10) / 10}s`;
        }
        // Fall back to calculating from timestamps
        if (!startedAt)
            return 'N/A';
        const start = new Date(startedAt);
        const end = completedAt ? new Date(completedAt) : new Date();
        const diffMs = end.getTime() - start.getTime();
        const diffSec = diffMs / 1000;
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin > 0) {
            return `${diffMin}m ${Math.floor(diffSec % 60)}s`;
        }
        return `${diffSec}s`;
    };
    const formatAge = (completedAt) => {
        if (!completedAt)
            return 'N/A';
        const completedDate = new Date(completedAt);
        const diffMs = new Date().getTime() - completedDate.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay > 0) {
            return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
        }
        if (diffHour > 0) {
            return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
        }
        if (diffMin > 0) {
            return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
        }
        if (diffSec > 0) {
            return diffSec === 1 ? '1 second ago' : `${diffSec} seconds ago`;
        }
        return 'just now';
    };
    const formatCompletionTime = (completedAt) => {
        if (!completedAt)
            return null;
        const completedDate = new Date(completedAt);
        return completedDate.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };
    return (React.createElement(Stack, { gap: "md", style: { position: 'relative' } },
        React.createElement(Group, { justify: "space-between" },
            React.createElement(Text, { size: "lg", fw: 700 }, "Simulations"),
            React.createElement(Button, { size: "xs", variant: "subtle", leftSection: React.createElement(IconRefresh, { size: 14 }), onClick: handleRefresh, loading: isRefreshing }, "Refresh")),
        React.createElement(LoadingOverlay, { visible: !simulationsLoaded || isRefreshing }),
        simulations.length === 0 ? (React.createElement(Text, { c: "dimmed", size: "sm" }, "No simulations found")) : (React.createElement(Stack, { gap: "sm" }, simulations.map((simulation) => (React.createElement(Paper, { key: simulation.id, withBorder: true, p: "sm" },
            React.createElement(Stack, { gap: "xs" },
                React.createElement(Group, { justify: "space-between", align: "center" },
                    React.createElement(Text, { size: "sm", fw: 600 },
                        simulation.id.substring(0, 8),
                        "..."),
                    React.createElement(Badge, { size: "sm", color: getStatusColor(simulation.status) }, simulation.status)),
                React.createElement(Group, { justify: "space-between", align: "center" },
                    React.createElement(Text, { size: "xs", c: "dimmed" }, simulation.startDate && simulation.endDate
                        ? `${simulation.startDate} to ${simulation.endDate}`
                        : 'N/A'),
                    React.createElement(Tooltip, { label: formatCompletionTime(simulation.completedAt) || 'No completion time', disabled: !simulation.completedAt, position: "top", withArrow: true },
                        React.createElement(Text, { size: "xs", c: "dimmed", style: { cursor: 'help' } }, formatAge(simulation.completedAt)))),
                simulation.status === 'running' && (React.createElement("div", null,
                    React.createElement(Progress, { value: simulation.totalSimulations && simulation.completedSimulations
                            ? (simulation.completedSimulations / simulation.totalSimulations) * 100
                            : 0, size: "xs" }),
                    React.createElement(Text, { size: "xs", c: "dimmed", mt: 4 },
                        simulation.completedSimulations || 0,
                        " / ",
                        simulation.totalSimulations || 0))),
                simulation.status === 'completed' && (React.createElement(Group, { justify: "space-between", align: "center" },
                    React.createElement(Text, { size: "xs", c: "dimmed" },
                        simulation.totalSimulations || '-',
                        " simulations"),
                    React.createElement(Text, { size: "xs", c: "dimmed" }, formatDuration(simulation.duration, simulation.startedAt, simulation.completedAt)))),
                simulation.status === 'error' && (React.createElement(Text, { size: "xs", c: "red" }, simulation.error || 'Unknown error')),
                React.createElement(Button, { size: "xs", variant: "light", fullWidth: true, leftSection: React.createElement(IconChartLine, { size: 12 }), disabled: simulation.status !== 'completed', onClick: () => handleViewGraph(simulation.id) }, "View Graph")))))))));
}
