import React, { useEffect } from 'react';
import { Container, Grid, Title, Stack } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { loadHealthcareConfigs } from '../../features/healthcare/actions';
import ConfigList from './configList';
import HsaSummary from './hsaSummary';
import DeductibleProgress from './deductibleProgress';
import HealthcareExpenses from './healthcareExpenses';
export default function Healthcare() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadHealthcareConfigs());
    }, [dispatch]);
    return (React.createElement(Container, { size: "xl", py: "md" },
        React.createElement(Stack, { gap: "xl" },
            React.createElement(Title, { order: 1 }, "Healthcare Management"),
            React.createElement(Grid, { gutter: "md" },
                React.createElement(Grid.Col, { span: 8 },
                    React.createElement(ConfigList, null)),
                React.createElement(Grid.Col, { span: 4 },
                    React.createElement(HsaSummary, null))),
            React.createElement(DeductibleProgress, null),
            React.createElement(HealthcareExpenses, null))));
}
