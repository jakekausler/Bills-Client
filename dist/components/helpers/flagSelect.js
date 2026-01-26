import React from 'react';
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';
import { IconCancel, IconFlag } from '@tabler/icons-react';
function FlagItem({ value, ...others }) {
    return (React.createElement(Group, { ...others }, value ? React.createElement(IconFlag, { color: `var(--mantine-color-${value}-4)`, size: 16 }) : React.createElement(IconCancel, { size: 16 })));
}
export const FlagSelect = ({ flagColor, onChange, dropdownProps, }) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    return (React.createElement(Combobox, { store: combobox, withinPortal: true, ...dropdownProps, onOptionSubmit: (option) => {
            onChange({ flagColor: option || null, flag: !!option });
            combobox.closeDropdown();
        } },
        React.createElement(Combobox.Target, null,
            React.createElement(InputBase, { component: "button", type: "button", pointer: true, rightSection: React.createElement(Combobox.Chevron, null), label: "Flag", onClick: () => combobox.openDropdown(), rightSectionPointerEvents: "none", multiline: true }, flagColor ? React.createElement(FlagItem, { value: flagColor }) : React.createElement(Input.Placeholder, null, "No Flag"))),
        React.createElement(Combobox.Dropdown, null,
            React.createElement(Combobox.Options, null, [
                { value: '', label: 'No Flag' },
                { value: 'red', label: 'Red' },
                { value: 'pink', label: 'Pink' },
                { value: 'grape', label: 'Grape' },
                { value: 'violet', label: 'Violet' },
                { value: 'indigo', label: 'Indigo' },
                { value: 'blue', label: 'Blue' },
                { value: 'cyan', label: 'Cyan' },
                { value: 'teal', label: 'Teal' },
                { value: 'green', label: 'Green' },
                { value: 'lime', label: 'Lime' },
                { value: 'yellow', label: 'Yellow' },
                { value: 'orange', label: 'Orange' },
                { value: 'gray', label: 'Gray' },
            ].map((option) => (React.createElement(Combobox.Option, { key: option.value, value: option.value },
                React.createElement(FlagItem, { value: option.value }))))))));
};
