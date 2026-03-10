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
  Customized,
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
        {(row.isCurrent || dayjs(row.periodStart).isAfter(dayjs(), 'day')) && (
          <Text size="xs" c="orange">Remaining: {formatDollar(Math.max(0, row.effectiveThreshold - row.totalSpent))}</Text>
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

  // Current period highlight: rendered via customized component for half-interval width
  const currentFill = currentPeriod
    ? (currentPeriod.totalSpent < currentPeriod.effectiveThreshold ? '#40c057' : '#fa5252')
    : undefined;

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
            {currentIndex >= 0 && currentFill && (
              <Customized
                component={(props: Record<string, unknown>) => {
                  const { xAxisMap, yAxisMap } = props as {
                    xAxisMap: Record<string, { scale: (v: string) => number; bandwidth?: () => number }>;
                    yAxisMap: Record<string, { y: number; height: number }>;
                  };
                  const xAxis = xAxisMap && Object.values(xAxisMap)[0];
                  const yAxis = yAxisMap && Object.values(yAxisMap)[0];
                  if (!xAxis || !yAxis || !currentPeriod) return null;

                  const cx = xAxis.scale(currentPeriod.label);
                  const bandwidth = xAxis.bandwidth?.() ?? 0;
                  // For point scales (no bandwidth), compute spacing from adjacent ticks
                  const spacing = bandwidth > 0 ? bandwidth : (
                    data.length > 1
                      ? Math.abs(xAxis.scale(data[1].label) - xAxis.scale(data[0].label))
                      : 100
                  );
                  const halfSpacing = spacing / 2;

                  const rawX = cx - halfSpacing + bandwidth / 2;
                  // Clamp left edge to the plot area (don't draw behind the Y axis)
                  const offset = (props as { offset?: { left: number } }).offset;
                  const plotLeft = offset?.left ?? rawX;
                  const clampedX = Math.max(rawX, plotLeft);
                  const clampedWidth = spacing - (clampedX - rawX);

                  return (
                    <rect
                      x={clampedX}
                      y={yAxis.y}
                      width={clampedWidth}
                      height={yAxis.height}
                      fill={currentFill}
                      fillOpacity={0.15}
                    />
                  );
                }}
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
