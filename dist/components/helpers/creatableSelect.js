import React from 'react';
import { useEffect, useState } from 'react';
import { CloseButton, Combobox, InputBase, useCombobox } from '@mantine/core';
export default function CreatableSelect({ data, value, onChange, label, error, clearable }) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [search, setSearch] = useState(value || '');
    useEffect(() => {
        setSearch(value || '');
    }, [value]);
    const filteredOptions = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()));
    const options = filteredOptions.map((item) => (React.createElement(Combobox.Option, { value: item.value, key: item.value }, item.label)));
    return (React.createElement(Combobox, { store: combobox, withinPortal: false, onOptionSubmit: (val) => {
            const option = data.find((item) => item.value === val);
            if (option) {
                setSearch(option.label);
                onChange(option.value);
            }
            combobox.closeDropdown();
        } },
        React.createElement(Combobox.Target, null,
            React.createElement(InputBase, { label: label, error: error, component: "input", pointer: true, value: search, onChange: (e) => {
                    const newValue = e.currentTarget.value;
                    setSearch(newValue);
                    // Try to find a matching option
                    const matchingOption = data.find((item) => item.label.toLowerCase() === newValue.toLowerCase().trim());
                    // Pass the matching value if found, otherwise pass the raw input
                    onChange(matchingOption ? matchingOption.value : newValue);
                    combobox.updateSelectedOptionIndex();
                    // Open dropdown if there are matching options
                    const hasMatches = data.some((item) => item.label.toLowerCase().includes(newValue.toLowerCase().trim()));
                    if (hasMatches && newValue) {
                        combobox.openDropdown();
                    }
                    else {
                        combobox.closeDropdown();
                    }
                }, rightSection: clearable && search ? (React.createElement(CloseButton, { size: "sm", onMouseDown: (e) => e.preventDefault(), onClick: () => {
                        onChange(null);
                        setSearch('');
                    }, "aria-label": "Clear value" })) : (React.createElement(Combobox.Chevron, null)), onClick: () => combobox.openDropdown(), rightSectionPointerEvents: clearable ? 'auto' : 'none', placeholder: "Pick value" })),
        React.createElement(Combobox.Dropdown, null,
            React.createElement(Combobox.Options, null, options.length > 0 ? options : React.createElement(Combobox.Empty, null, "Nothing found")))));
}
