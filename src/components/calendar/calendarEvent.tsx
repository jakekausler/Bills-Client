import React from 'react';
import { Box, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { CSSProperties } from 'react';
import { CalendarBill } from '../../types/types';

interface CalendarEventProps {
  event: CalendarBill
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 4px',
    gap: '4px',
    fontSize: 'inherit', // This will inherit the size from react-big-calendar
  };

  const nameStyle: CSSProperties = {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 'inherit',
  };

  const amountStyle: CSSProperties = {
    flexShrink: 0,
    fontWeight: 500,
    fontSize: 'inherit',
  };

  const tooltipContent = (
    <Stack gap={2}>
      <Group justify="space-between">
        <b>{event.name}</b>
        <Box>$ {event.amount.toFixed(2)}</Box>
      </Group>
      <Divider />
      <Stack gap={0}>
        {event.isTransfer && (
          <>
            <Box p={0} m={0}><b>From</b> {event.from}</Box>
            <Box p={0} m={0}><b>To</b> {event.to}</Box>
          </>
        ) || (
            <Box p={0} m={0}><b>Account</b> {event.account}</Box>
          )}
        <Box p={0} m={0}><b>Category</b> {event.category}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Tooltip label={tooltipContent} withArrow color="dark.6" radius="md" arrowSize={10}>
      <Box style={containerStyle}>
        <Text style={nameStyle}>{event.name}</Text>
        <Text style={amountStyle}>${event.amount.toFixed(2)}</Text>
      </Box>
    </Tooltip>
  );
} 
