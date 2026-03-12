import React from 'react';
import { Group } from '@mantine/core';
import { FlagSelect } from '../../helpers/flagSelect';

interface FlagSectionProps {
  flagColor: string | null;
  onChange: (value: { flagColor: string | null; flag: boolean }) => void;
  dropdownProps?: any;
}

export const FlagSection: React.FC<FlagSectionProps> = ({
  flagColor,
  onChange,
  dropdownProps,
}) => {
  return (
    <Group w="100%">
      <FlagSelect
        flagColor={flagColor}
        onChange={onChange}
        dropdownProps={dropdownProps}
      />
    </Group>
  );
};
