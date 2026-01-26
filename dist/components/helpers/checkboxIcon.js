import React from 'react';
import { Box } from '@mantine/core';
export function CheckboxIcon({ checked, onChange, checkedIcon, uncheckedIcon, }) {
    return React.createElement(Box, { onClick: () => onChange(!checked) }, checked ? checkedIcon : uncheckedIcon);
}
