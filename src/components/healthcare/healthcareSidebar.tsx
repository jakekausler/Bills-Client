import React from 'react';
import { Stack, Text } from '@mantine/core';

type HealthcareSidebarProps = {
  close: () => void;
};

export default function HealthcareSidebar({ close }: HealthcareSidebarProps) {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">
        Use this page to manage healthcare configurations, track deductible progress, and view
        healthcare expenses.
      </Text>
    </Stack>
  );
}
