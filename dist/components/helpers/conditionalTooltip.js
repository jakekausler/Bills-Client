import React from 'react';
import { Tooltip } from '@mantine/core';
export const ConditionalTooltip = ({ children, label, condition, }) => {
    if (condition) {
        return React.createElement(Tooltip, { label: label }, children);
    }
    return children;
};
