import React from 'react';
import { Stack, Text } from '@mantine/core';

interface TaxSummarySidebarProps {
  close: () => void;
}

export default function TaxSummarySidebar({ close }: TaxSummarySidebarProps) {
  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Tax Summary sidebar content can be extended here with filters and controls.
      </Text>
    </Stack>
  );
}
