import React from "react";
import { Combobox, Group, Input, InputBase, useCombobox } from "@mantine/core";
import { IconCancel, IconFlag } from "@tabler/icons-react";

function FlagItem({ value, ...others }: { value: string }) {
  return (
    <Group {...others}>
      {value ? (
        <IconFlag color={`var(--mantine-color-${value}-4)`} size={16} />
      ) : (
        <IconCancel size={16} />
      )}
    </Group>
  )
}

export const FlagSelect = ({ flagColor, onChange, dropdownProps }: { flagColor: string | null; onChange: (v: { flagColor: string | null; flag: boolean }) => void; dropdownProps?: any }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      {...dropdownProps}
      onOptionSubmit={(option) => {
        onChange({ flagColor: option || null, flag: !!option });
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          label="Flag"
          onClick={() => combobox.openDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {flagColor ? (
            <FlagItem value={flagColor} />
          ) : (
            <Input.Placeholder>No Flag</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {[
            { value: "", label: "No Flag" },
            { value: "red", label: "Red" },
            { value: "pink", label: "Pink" },
            { value: "grape", label: "Grape" },
            { value: "violet", label: "Violet" },
            { value: "indigo", label: "Indigo" },
            { value: "blue", label: "Blue" },
            { value: "cyan", label: "Cyan" },
            { value: "teal", label: "Teal" },
            { value: "green", label: "Green" },
            { value: "lime", label: "Lime" },
            { value: "yellow", label: "Yellow" },
            { value: "orange", label: "Orange" },
            { value: "gray", label: "Gray" }
          ].map((option) => (
            <Combobox.Option value={option.value}>
              <FlagItem key={option.value} value={option.value} />
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
