import React from 'react';
import { Stack, Text } from '@mantine/core';
export default function HealthcareSidebar({ close }) {
    return (React.createElement(Stack, { gap: "md", p: "md" },
        React.createElement(Text, { size: "sm", c: "dimmed" }, "Use this page to manage healthcare configurations, track deductible progress, and view healthcare expenses.")));
}
