import React from 'react';
import {
  ActionIcon,
  Checkbox,
  Group,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { IconTrash, IconVariable, IconVariableOff } from '@tabler/icons-react';
import { SpendingTrackerCategory } from '../../types/types';

type ThresholdChange = SpendingTrackerCategory['thresholdChanges'][number];

type ThresholdChangeRowProps = {
  change: ThresholdChange;
  index: number;
  onChange: (index: number, updates: Partial<ThresholdChange>) => void;
  onDelete: (index: number) => void;
  amountVariables: string[];
  dateVariables: string[];
};

const ThresholdChangeRow: React.FC<ThresholdChangeRowProps> = ({
  change,
  index,
  onChange,
  onDelete,
  amountVariables,
  dateVariables,
}) => {
  return (
    <Group gap="xs" align="flex-end" wrap="nowrap">
      {/* Date field with variable toggle */}
      {!change.dateIsVariable ? (
        <TextInput
          label="Date"
          placeholder="YYYY-MM-DD"
          value={change.date}
          onChange={(e) => onChange(index, { date: e.target.value })}
          style={{ flex: 1 }}
          size="xs"
        />
      ) : (
        <Select
          label="Date"
          value={change.dateVariable}
          data={dateVariables.map((v) => ({ label: v, value: v }))}
          onChange={(v) => {
            if (v) onChange(index, { dateVariable: v });
          }}
          style={{ flex: 1 }}
          size="xs"
        />
      )}
      <ActionIcon
        mb={2}
        ml={-10}
        size="sm"
        onClick={() => onChange(index, { dateIsVariable: !change.dateIsVariable })}
      >
        {change.dateIsVariable ? <IconVariable size={14} /> : <IconVariableOff size={14} />}
      </ActionIcon>

      {/* New Threshold field with variable toggle */}
      {!change.newThresholdIsVariable ? (
        <NumberInput
          label="New Threshold"
          value={change.newThreshold}
          onChange={(v) => {
            onChange(index, { newThreshold: typeof v === 'number' ? v : parseFloat(v) || 0 });
          }}
          prefix="$"
          decimalScale={2}
          style={{ flex: 1 }}
          size="xs"
        />
      ) : (
        <Select
          label="New Threshold"
          value={change.newThresholdVariable}
          data={amountVariables.map((v) => ({ label: v, value: v }))}
          onChange={(v) => {
            if (v) onChange(index, { newThresholdVariable: v });
          }}
          style={{ flex: 1 }}
          size="xs"
        />
      )}
      <ActionIcon
        mb={2}
        ml={-10}
        size="sm"
        onClick={() => onChange(index, { newThresholdIsVariable: !change.newThresholdIsVariable })}
      >
        {change.newThresholdIsVariable ? <IconVariable size={14} /> : <IconVariableOff size={14} />}
      </ActionIcon>

      {/* Reset Carry checkbox */}
      <Checkbox
        label="Reset Carry"
        checked={change.resetCarry}
        onChange={(e) => onChange(index, { resetCarry: e.currentTarget.checked })}
        size="xs"
        mb={4}
      />

      {/* Delete button */}
      <ActionIcon
        color="red"
        variant="light"
        size="sm"
        mb={2}
        onClick={() => onDelete(index)}
      >
        <IconTrash size={14} />
      </ActionIcon>
    </Group>
  );
};

export default ThresholdChangeRow;
