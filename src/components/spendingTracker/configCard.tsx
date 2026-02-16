import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { IconAlertCircle, IconPlus, IconVariable, IconVariableOff } from '@tabler/icons-react';
import { AppDispatch } from '../../store';
import { selectSelectedCategory } from '../../features/spendingTracker/select';
import { updateSelectedCategory } from '../../features/spendingTracker/slice';
import { saveCategory } from '../../features/spendingTracker/actions';
import { selectAllAccounts } from '../../features/accounts/select';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
import { SpendingTrackerCategory } from '../../types/types';
import ThresholdChangeRow from './thresholdChangeRow';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MONTHLY_DAYS = Array.from({ length: 28 }, (_, i) => String(i + 1));

const ConfigCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const category = useSelector(selectSelectedCategory);
  const accounts = useSelector(selectAllAccounts);
  const simulationVariables = useSelector(selectSelectedSimulationVariables);

  const amountVariables = useMemo(() => {
    if (!simulationVariables) return [];
    return Object.entries(simulationVariables)
      .filter(([, value]) => value.type === 'amount')
      .map(([name]) => name);
  }, [simulationVariables]);

  const dateVariables = useMemo(() => {
    if (!simulationVariables) return [];
    return Object.entries(simulationVariables)
      .filter(([, value]) => value.type === 'date')
      .map(([name]) => name);
  }, [simulationVariables]);

  // Build account dropdown options grouped by type
  const accountOptions = useMemo(() => {
    const result: { group: string; items: { value: string; label: string }[] }[] = [];
    const accountsByType: Record<string, { value: string; label: string }[]> = {};
    for (const account of accounts) {
      if (!(account.type in accountsByType)) {
        accountsByType[account.type] = [];
      }
      accountsByType[account.type].push({
        value: account.id,
        label: account.name,
      });
    }
    for (const [group, items] of Object.entries(accountsByType)) {
      result.push({ group, items });
    }
    return result;
  }, [accounts]);

  // Check if the selected accountId is valid
  const accountExists = category ? accounts.some((a) => a.id === category.accountId) : false;

  if (!category) return null;

  const updateField = (updates: Partial<SpendingTrackerCategory>) => {
    dispatch(updateSelectedCategory(updates));
  };

  const handleSave = () => {
    dispatch(saveCategory(category.id, category));
  };

  const isValid = () => {
    if (!category.name.trim()) return false;
    if (!category.accountId || !accountExists) return false;
    return true;
  };

  // Render interval start field based on interval type
  const renderIntervalStart = () => {
    switch (category.interval) {
      case 'weekly':
        return (
          <Select
            label="Interval Start"
            data={DAYS_OF_WEEK.map((d) => ({ value: d, label: d }))}
            value={category.intervalStart}
            onChange={(v) => {
              if (v) updateField({ intervalStart: v });
            }}
          />
        );
      case 'monthly':
        return (
          <Select
            label="Interval Start"
            data={MONTHLY_DAYS.map((d) => ({ value: d, label: d }))}
            value={category.intervalStart}
            onChange={(v) => {
              if (v) updateField({ intervalStart: v });
            }}
          />
        );
      case 'yearly':
        return (
          <TextInput
            label="Interval Start"
            placeholder="MM/DD"
            value={category.intervalStart}
            onChange={(e) => updateField({ intervalStart: e.target.value })}
          />
        );
      default:
        return null;
    }
  };

  const handleDeleteThresholdChange = (index: number) => {
    const updated = [...category.thresholdChanges];
    updated.splice(index, 1);
    updateField({ thresholdChanges: updated });
  };

  const handleThresholdChangeUpdate = (
    index: number,
    updates: Partial<SpendingTrackerCategory['thresholdChanges'][number]>,
  ) => {
    const updated = [...category.thresholdChanges];
    updated[index] = { ...updated[index], ...updates };
    updateField({ thresholdChanges: updated });
  };

  const handleAddThresholdChange = () => {
    const newChange: SpendingTrackerCategory['thresholdChanges'][number] = {
      date: '',
      dateIsVariable: false,
      dateVariable: null,
      newThreshold: 0,
      newThresholdIsVariable: false,
      newThresholdVariable: null,
      resetCarry: false,
    };
    updateField({ thresholdChanges: [...category.thresholdChanges, newChange] });
  };

  return (
    <Card shadow="sm" p="md">
      <Stack gap="sm">
        {/* Name */}
        <TextInput
          label="Name"
          value={category.name}
          onChange={(e) => updateField({ name: e.target.value })}
        />

        {/* Threshold with variable toggle */}
        <Group w="100%">
          {!category.thresholdIsVariable && (
            <NumberInput
              style={{ flex: 1 }}
              label="Threshold"
              value={category.threshold}
              onChange={(v) => {
                updateField({ threshold: typeof v === 'number' ? v : parseFloat(v) || 0 });
              }}
              prefix="$"
              decimalScale={2}
            />
          )}
          {category.thresholdIsVariable && (
            <Select
              style={{ flex: 1 }}
              label="Threshold"
              value={category.thresholdVariable}
              data={amountVariables.map((v) => ({ label: v, value: v }))}
              onChange={(v) => {
                if (v) updateField({ thresholdVariable: v });
              }}
            />
          )}
          <ActionIcon
            mt={22}
            ml={-12}
            onClick={() => {
              updateField({ thresholdIsVariable: !category.thresholdIsVariable });
            }}
          >
            {category.thresholdIsVariable ? <IconVariable /> : <IconVariableOff />}
          </ActionIcon>
        </Group>

        {/* Interval */}
        <Group grow>
          <Select
            label="Interval"
            data={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={category.interval}
            onChange={(v) => {
              if (!v) return;
              const updates: Partial<SpendingTrackerCategory> = {
                interval: v as SpendingTrackerCategory['interval'],
              };
              // Reset intervalStart to a sensible default when interval changes
              if (v === 'weekly') updates.intervalStart = 'Saturday';
              else if (v === 'monthly') updates.intervalStart = '1';
              else if (v === 'yearly') updates.intervalStart = '01/01';
              updateField(updates);
            }}
          />
          {renderIntervalStart()}
        </Group>

        {/* Account */}
        <Stack gap={4}>
          <Select
            label="Account"
            data={accountOptions}
            value={category.accountId}
            onChange={(v) => {
              if (v) updateField({ accountId: v });
            }}
            searchable
          />
          {category.accountId && !accountExists && (
            <Alert icon={<IconAlertCircle size={14} />} color="yellow" p="xs">
              <Text size="xs">
                The selected account no longer exists. Please choose a valid account.
              </Text>
            </Alert>
          )}
        </Stack>

        {/* Carry Over / Carry Under */}
        <Group>
          <Switch
            label="Carry Over"
            checked={category.carryOver}
            onChange={(e) => updateField({ carryOver: e.currentTarget.checked })}
          />
          <Switch
            label="Carry Under"
            checked={category.carryUnder}
            onChange={(e) => updateField({ carryUnder: e.currentTarget.checked })}
          />
        </Group>

        {/* Inflation Rate with variable toggle */}
        <Group w="100%">
          {!category.increaseByIsVariable && (
            <NumberInput
              style={{ flex: 1 }}
              label="Inflation Rate"
              value={category.increaseBy}
              onChange={(v) => {
                updateField({ increaseBy: typeof v === 'number' ? v : parseFloat(v) || 0 });
              }}
              suffix="%"
              decimalScale={2}
            />
          )}
          {category.increaseByIsVariable && (
            <Select
              style={{ flex: 1 }}
              label="Inflation Rate"
              value={category.increaseByVariable}
              data={amountVariables.map((v) => ({ label: v, value: v }))}
              onChange={(v) => {
                if (v) updateField({ increaseByVariable: v });
              }}
            />
          )}
          <ActionIcon
            mt={22}
            ml={-12}
            onClick={() => {
              updateField({ increaseByIsVariable: !category.increaseByIsVariable });
            }}
          >
            {category.increaseByIsVariable ? <IconVariable /> : <IconVariableOff />}
          </ActionIcon>
        </Group>

        {/* Inflation Date */}
        <TextInput
          label="Inflation Date"
          placeholder="MM/DD"
          value={category.increaseByDate}
          onChange={(e) => updateField({ increaseByDate: e.target.value })}
        />

        {/* Start Date */}
        <TextInput
          label="Start Date"
          placeholder="YYYY-MM-DD (optional)"
          value={category.startDate || ''}
          onChange={(e) => updateField({ startDate: e.target.value || null })}
        />

        <Divider my="xs" />

        {/* Threshold Changes */}
        <Group justify="space-between">
          <Text fw={600}>Threshold Changes</Text>
          <Button
            leftSection={<IconPlus size={14} />}
            variant="light"
            size="xs"
            onClick={handleAddThresholdChange}
          >
            Add
          </Button>
        </Group>

        {category.thresholdChanges.length === 0 && (
          <Text size="sm" c="dimmed">
            No threshold changes configured
          </Text>
        )}

        {category.thresholdChanges.map((tc, index) => (
          <ThresholdChangeRow
            key={index}
            change={tc}
            index={index}
            onChange={handleThresholdChangeUpdate}
            onDelete={handleDeleteThresholdChange}
            amountVariables={amountVariables}
            dateVariables={dateVariables}
          />
        ))}

        <Divider my="xs" />

        {/* Save Button */}
        <Button onClick={handleSave} fullWidth disabled={!isValid()}>
          Save
        </Button>
      </Stack>
    </Card>
  );
};

export default ConfigCard;
