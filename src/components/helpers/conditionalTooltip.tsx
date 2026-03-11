import React from 'react';
import { Tooltip } from '@mantine/core';

export const ConditionalTooltip = ({
  children,
  label,
  condition,
}: {
  children: React.ReactNode;
  label: React.ReactNode | string;
  condition: boolean;
}) => {
  if (condition) {
    return <Tooltip label={label} events={{ hover: true, focus: true, touch: true }}>{children}</Tooltip>;
  }
  return children;
};
