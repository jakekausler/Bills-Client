import React from 'react';
import { Box } from '@mantine/core';

export function CheckboxIcon({
  checked,
  onChange,
  checkedIcon,
  uncheckedIcon,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedIcon: React.ReactNode;
  uncheckedIcon: React.ReactNode;
  ariaLabel?: string;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <Box
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      aria-label={ariaLabel || 'Toggle selection'}
      onClick={() => onChange(!checked)}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
    >
      {checked ? checkedIcon : uncheckedIcon}
    </Box>
  );
}
