import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Select, SegmentedControl, Switch, Text, Badge } from '@mantine/core';
import { AppDispatch } from '../../store';
import {
  selectReportingAccount,
  selectShowReal,
  selectShowDeterministic,
  selectGraphMetadata,
  selectMonteCarloLabels,
} from '../../features/monteCarlo/select';
import {
  setReportingAccount,
  setShowReal,
  setShowDeterministic,
} from '../../features/monteCarlo/slice';
import { loadSimulationGraph } from '../../features/monteCarlo/actions';

interface ControlsBarProps {
  simulationId: string;
  accountNames: Array<{ id: string; name: string }>;
}

export function ControlsBar({ simulationId, accountNames }: ControlsBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reportingAccount = useSelector(selectReportingAccount);
  const showReal = useSelector(selectShowReal);
  const showDeterministic = useSelector(selectShowDeterministic);
  const graphMetadata = useSelector(selectGraphMetadata);
  const labels = useSelector(selectMonteCarloLabels);

  const accountOptions = [
    { value: '__combined__', label: 'All Combined' },
    ...accountNames.map((acct) => ({ value: acct.id, label: acct.name })),
  ];

  const handleAccountChange = useCallback(
    (value: string | null) => {
      const accountId = value === '__combined__' ? null : value;
      dispatch(setReportingAccount(accountId));
      dispatch(loadSimulationGraph(simulationId, accountId));
    },
    [dispatch, simulationId],
  );

  const handleRealNominalChange = useCallback(
    (value: string) => {
      dispatch(setShowReal(value === 'real'));
    },
    [dispatch],
  );

  const handleDeterministicChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setShowDeterministic(event.currentTarget.checked));
    },
    [dispatch],
  );

  // Derive date range from labels
  const dateRange =
    labels.length > 0 ? `${labels[0]} - ${labels[labels.length - 1]}` : '';

  return (
    <Group justify="space-between" wrap="wrap" gap="md">
      <Group gap="md" wrap="wrap">
        <Select
          label="Account"
          data={accountOptions}
          value={reportingAccount ?? '__combined__'}
          onChange={handleAccountChange}
          size="sm"
          style={{ minWidth: 200 }}
          allowDeselect={false}
        />

        <div>
          <Text size="sm" fw={500} mb={4}>
            Values
          </Text>
          <SegmentedControl
            data={[
              { label: 'Nominal', value: 'nominal' },
              { label: 'Real', value: 'real' },
            ]}
            value={showReal ? 'real' : 'nominal'}
            onChange={handleRealNominalChange}
            size="sm"
          />
        </div>

        <div style={{ paddingTop: 24 }}>
          <Switch
            label="Deterministic"
            checked={showDeterministic}
            onChange={handleDeterministicChange}
            size="sm"
          />
        </div>
      </Group>

      <Group gap="xs" wrap="wrap">
        {graphMetadata.totalSimulations != null && (
          <Badge variant="light" color="blue" size="lg">
            {graphMetadata.totalSimulations} sims
          </Badge>
        )}
        {dateRange && (
          <Badge variant="light" color="teal" size="lg">
            {dateRange}
          </Badge>
        )}
      </Group>
    </Group>
  );
}
