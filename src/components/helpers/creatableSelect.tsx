import React from 'react';
import { useEffect, useState } from 'react';
import { CloseButton, Combobox, InputBase, useCombobox } from '@mantine/core';

interface CreatableSelectProps {
  data: { label: string; value: string }[];
  value: string;
  onChange: (value: string | null) => void;
  label?: string;
  error: string | null;
  clearable?: boolean;
}

export default function CreatableSelect({ data, value, onChange, label, error, clearable }: CreatableSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState(value || '');

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  const filteredOptions = data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        const option = data.find((item) => item.value === val);
        if (option) {
          setSearch(option.label);
          onChange(option.value);
        }
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          error={error}
          component="input"
          pointer
          value={search}
          onChange={(e) => {
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
            } else {
              combobox.closeDropdown();
            }
          }}
          rightSection={
            clearable && search ? (
              <CloseButton
                size="sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(null);
                  setSearch('');
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.openDropdown()}
          rightSectionPointerEvents={clearable ? 'auto' : 'none'}
          placeholder="Pick value"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
