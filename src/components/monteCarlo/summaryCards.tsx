import React from 'react';
import { useSelector } from 'react-redux';
import { Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import {
  selectGraphMetadata,
  selectShowReal,
  selectMonteCarloLabels,
} from '../../features/monteCarlo/select';

import { formatDollar } from './utils';

function fundedRatioColor(ratio: number): string {
  if (ratio >= 90) return 'var(--mantine-color-green-6)';
  if (ratio >= 70) return 'var(--mantine-color-yellow-6)';
  return 'var(--mantine-color-red-6)';
}

export function SummaryCards() {
  const graphMetadata = useSelector(selectGraphMetadata);
  const showReal = useSelector(selectShowReal);
  const labels = useSelector(selectMonteCarloLabels);

  const { fundedRatio, failedSimulations, totalSimulations, finalYear, worstYear } =
    graphMetadata;

  // Derive end year from the last label (format "YYYY-MM-DD" or "YYYY")
  const endYear = labels.length > 0 ? labels[labels.length - 1].substring(0, 4) : '';

  // If there is no metadata yet, don't render
  if (fundedRatio == null && finalYear == null && worstYear == null) {
    return null;
  }

  const median = finalYear
    ? showReal
      ? finalYear.realMedian
      : finalYear.median
    : undefined;

  const p5 = finalYear
    ? showReal
      ? finalYear.realP5
      : finalYear.p5
    : undefined;

  const worstBalance = worstYear
    ? showReal
      ? worstYear.realMedianMinBalance
      : worstYear.medianMinBalance
    : undefined;

  return (
    <Group gap="xs" wrap="wrap">
      {/* Card 1: Funded Ratio */}
      {fundedRatio != null && (
        <Tooltip label={`${failedSimulations ?? 0} of ${totalSimulations ?? 0} failed`}>
          <Paper withBorder p="xs" radius="md" style={{ flex: '1 1 120px', minWidth: 120 }}>
            <Stack align="center" gap={2}>
              <Text style={{ fontSize: 9 }} c="dimmed" tt="uppercase" fw={600}>
                Funded Ratio
              </Text>
              <Text
                style={{ fontSize: 20, color: fundedRatioColor(fundedRatio) }}
                fw={700}
              >
                {fundedRatio.toFixed(0)}%
              </Text>
            </Stack>
          </Paper>
        </Tooltip>
      )}

      {/* Card 2: Median Final */}
      {median != null && (
        <Tooltip label={`50th percentile, ${endYear}`}>
          <Paper withBorder p="xs" radius="md" style={{ flex: '1 1 120px', minWidth: 120 }}>
            <Stack align="center" gap={2}>
              <Text style={{ fontSize: 9 }} c="dimmed" tt="uppercase" fw={600}>
                Median Final
              </Text>
              <Text style={{ fontSize: 20 }} fw={700}>
                {formatDollar(median)}
              </Text>
            </Stack>
          </Paper>
        </Tooltip>
      )}

      {/* Card 3: 5th Percentile Final */}
      {p5 != null && (
        <Tooltip label={`Worst-case final, ${endYear}`}>
          <Paper withBorder p="xs" radius="md" style={{ flex: '1 1 120px', minWidth: 120 }}>
            <Stack align="center" gap={2}>
              <Text style={{ fontSize: 9 }} c="dimmed" tt="uppercase" fw={600}>
                5th Percentile
              </Text>
              <Text style={{ fontSize: 20 }} fw={700}>
                {formatDollar(p5)}
              </Text>
            </Stack>
          </Paper>
        </Tooltip>
      )}

      {/* Card 4: Worst Year */}
      {worstBalance != null && worstYear && (
        <Tooltip label={`Median min balance, ${worstYear.year}`}>
          <Paper withBorder p="xs" radius="md" style={{ flex: '1 1 120px', minWidth: 120 }}>
            <Stack align="center" gap={2}>
              <Text style={{ fontSize: 9 }} c="dimmed" tt="uppercase" fw={600}>
                Worst Year
              </Text>
              <Text style={{ fontSize: 20 }} fw={700}>
                {formatDollar(worstBalance)}
              </Text>
            </Stack>
          </Paper>
        </Tooltip>
      )}
    </Group>
  );
}
