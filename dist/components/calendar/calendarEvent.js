import React from 'react';
import { Box, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
export function CalendarEvent({ event }) {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '0 4px',
        gap: '4px',
        fontSize: 'inherit', // This will inherit the size from react-big-calendar
    };
    const nameStyle = {
        flexGrow: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 'inherit',
    };
    const amountStyle = {
        flexShrink: 0,
        fontWeight: 500,
        fontSize: 'inherit',
    };
    const tooltipContent = (React.createElement(Stack, { gap: 2 },
        React.createElement(Group, { justify: "space-between" },
            React.createElement("b", null, event.name),
            React.createElement(Box, null,
                "$ ",
                event.amount.toFixed(2))),
        React.createElement(Divider, null),
        React.createElement(Stack, { gap: 0 },
            (event.isTransfer && (React.createElement(React.Fragment, null,
                React.createElement(Box, { p: 0, m: 0 },
                    React.createElement("b", null, "From"),
                    " ",
                    event.from),
                React.createElement(Box, { p: 0, m: 0 },
                    React.createElement("b", null, "To"),
                    " ",
                    event.to)))) || (React.createElement(Box, { p: 0, m: 0 },
                React.createElement("b", null, "Account"),
                " ",
                event.account)),
            React.createElement(Box, { p: 0, m: 0 },
                React.createElement("b", null, "Category"),
                " ",
                event.category))));
    return (React.createElement(Tooltip, { label: tooltipContent, withArrow: true, color: "dark.6", radius: "md", arrowSize: 10 },
        React.createElement(Box, { style: containerStyle },
            React.createElement(Text, { style: nameStyle }, event.name),
            React.createElement(Text, { style: amountStyle },
                "$",
                event.amount.toFixed(2)))));
}
