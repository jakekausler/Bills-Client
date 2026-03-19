import React from 'react';
import { useSelector } from 'react-redux';
import { Group, Paper, Stack, Text } from '@mantine/core';
import {
  selectGraphMetadata,
  selectShowReal,
  selectMonteCarloLabels,
} from '../../features/monteCarlo/select';

/** Format a dollar value with K/M/B suffixes. */
function formatDollar(value: number): string {
  const neg = value < 0;
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = `$${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `$${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `$${(abs / 1_000).toFixed(0)}K`;
  } else {
    formatted = `$${abs.toFixed(0)}`;
  }
  return neg ? `-${formatted}` : formatted;
}

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
    <Group gap="md" wrap="wrap">
      {/* Card 1: Funded Ratio */}
      {fundedRatio != null && (
        <Paper withBorder p="md" radius="md" style={{ flex: '1 1 180px', minWidth: 180 }}>
          <Stack align="center" gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Funded Ratio
            </Text>
            <Text
              size="xl"
              fw={700}
              style={{ color: fundedRatioColor(fundedRatio) }}
            >
              {fundedRatio.toFixed(0)}%
            </Text>
            <Text size="xs" c="dimmed">
              {failedSimulations ?? 0} of {totalSimulations ?? 0} failed
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Card 2: Median Final */}
      {median != null && (
        <Paper withBorder p="md" radius="md" style={{ flex: '1 1 180px', minWidth: 180 }}>
          <Stack align="center" gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Median Final
            </Text>
            <Text size="xl" fw={700}>
              {formatDollar(median)}
            </Text>
            <Text size="xs" c="dimmed">
              50th percentile, {endYear}
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Card 3: 5th Percentile Final */}
      {p5 != null && (
        <Paper withBorder p="md" radius="md" style={{ flex: '1 1 180px', minWidth: 180 }}>
          <Stack align="center" gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              5th Percentile
            </Text>
            <Text size="xl" fw={700}>
              {formatDollar(p5)}
            </Text>
            <Text size="xs" c="dimmed">
              Worst-case final, {endYear}
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Card 4: Worst Year */}
      {worstBalance != null && worstYear && (
        <Paper withBorder p="md" radius="md" style={{ flex: '1 1 180px', minWidth: 180 }}>
          <Stack align="center" gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Worst Year
            </Text>
            <Text size="xl" fw={700}>
              {formatDollar(worstBalance)}
            </Text>
            <Text size="xs" c="dimmed">
              Median min balance, {worstYear.year}
            </Text>
          </Stack>
        </Paper>
      )}
    </Group>
  );
}
