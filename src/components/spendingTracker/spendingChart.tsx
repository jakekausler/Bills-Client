import React from 'react';
import {
  Card,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceArea,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from 'recharts';
import dayjs from 'dayjs';
import { ChartDataResponse, ChartDataPoint } from '../../types/types';

type SpendingChartProps = {
  chartData: ChartDataResponse | null;
  loading: boolean;
};

type ChartRow = ChartDataPoint & {
  label: string;
};

function formatPeriodLabel(periodStart: string, periodEnd: string): string {
  const start = dayjs(periodStart);
  const end = dayjs(periodEnd);

  // If same month and year, show "Jan 1 - 7"
  if (start.month() === end.month() && start.year() === end.year()) {
    return `${start.format('MMM D')} - ${end.format('D')}`;
  }
  // If same year but different month, show "Jan 1 - Feb 7"
  if (start.year() === end.year()) {
    return `${start.format('MMM D')} - ${end.format('MMM D')}`;
  }
  // Different years
  return `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`;
}

function formatDollar(value: number): string {
  return `$${value.toFixed(2)}`;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0]?.payload as ChartRow | undefined;
  if (!row) return null;

  const start = dayjs(row.periodStart);
  const end = dayjs(row.periodEnd);
  const dateRange = `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`;

  return (
    <Card shadow="md" p="xs" style={{ backgroundColor: 'var(--mantine-color-body)' }}>
      <Stack gap={4}>
        <Text size="xs" fw={600}>{dateRange}</Text>
        <Text size="xs" c="blue">Spent: {formatDollar(row.totalSpent)}</Text>
        <Text size="xs" c="green">Effective Threshold: {formatDollar(row.effectiveThreshold)}</Text>
        {row.baseThreshold !== row.effectiveThreshold && (
          <Text size="xs" c="dimmed">Base Threshold: {formatDollar(row.baseThreshold)}</Text>
        )}
        {row.carryAfter !== 0 && (
          <Text size="xs" c="dimmed">Carry: {formatDollar(row.carryAfter)}</Text>
        )}
        {row.isCurrent && (
          <Text size="xs" fw={600} c="yellow">Current Period</Text>
        )}
      </Stack>
    </Card>
  );
};

const SpendingChart = ({ chartData, loading }: SpendingChartProps) => {
  if (loading) {
    return (
      <Card shadow="sm" p="md">
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text c="dimmed">Loading chart data...</Text>
        </Group>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card shadow="sm" p="md">
        <Text c="dimmed" ta="center" py="xl">
          No chart data available
        </Text>
      </Card>
    );
  }

  const data: ChartRow[] = chartData.periods.map((p) => ({
    ...p,
    label: formatPeriodLabel(p.periodStart, p.periodEnd),
  }));

  const currentIndex = data.findIndex((d) => d.isCurrent);
  const currentPeriod = currentIndex >= 0 ? data[currentIndex] : undefined;

  // For the ReferenceArea, use the previous and next period labels to create visible width.
  // If the current period is at an edge, fall back to the current label (still zero-width,
  // so skip the ReferenceArea entirely when there are no neighbors).
  let refAreaX1: string | undefined;
  let refAreaX2: string | undefined;
  if (currentPeriod && data.length > 1) {
    const prevLabel = currentIndex > 0 ? data[currentIndex - 1].label : undefined;
    const nextLabel = currentIndex < data.length - 1 ? data[currentIndex + 1].label : undefined;
    refAreaX1 = prevLabel || currentPeriod.label;
    refAreaX2 = nextLabel || currentPeriod.label;
  }

  return (
    <Card shadow="sm" p="md">
      <Stack gap="md">
        <Text fw={600}>Spending Chart</Text>

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalSpent"
              stroke="#228be6"
              name="Spending"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="effectiveThreshold"
              stroke="#40c057"
              name="Effective Threshold"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="baseThreshold"
              stroke="#adb5bd"
              name="Base Threshold"
              strokeDasharray="5 5"
              dot={false}
            />
            {currentPeriod && refAreaX1 && refAreaX2 && refAreaX1 !== refAreaX2 && (
              <ReferenceArea
                x1={refAreaX1}
                x2={refAreaX2}
                fill={currentPeriod.totalSpent < currentPeriod.effectiveThreshold ? '#40c057' : '#fa5252'}
                fillOpacity={0.15}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        <Group justify="center">
          <Text size="sm" fw={500}>
            Total spent: {formatDollar(chartData.cumulativeSpent)} / {formatDollar(chartData.cumulativeThreshold)} cumulative threshold
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default SpendingChart;
