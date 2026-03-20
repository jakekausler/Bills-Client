import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Select, Skeleton, Stack, Tabs, Text, VisuallyHidden } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
  selectIncomeExpenseData,
  selectIncomeExpenseLoaded,
  selectIncomeExpenseError,
} from '../../features/monteCarlo/select';
import { loadIncomeExpense } from '../../features/monteCarlo/actions';
import { MCViewProps, registerView } from './viewRegistry';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { AppDispatch } from '../../store';
import { formatDollar, formatDollarFull } from './utils';
import type { FanData } from '../../types/types';

Chart.register(...registerables);

/** 20 distinct categorical colors for stacked area series. */
const PALETTE = [
  '#4c6ef5', '#51cf66', '#fcc419', '#ff6b6b', '#845ef7',
  '#22b8cf', '#ff922b', '#20c997', '#e64980', '#adb5bd',
  '#5c7cfa', '#94d82d', '#fab005', '#f06595', '#7950f2',
  '#15aabf', '#fd7e14', '#12b886', '#e8590c', '#868e96',
];

/** Band definitions for fan charts: [lowerPercentile, upperPercentile, opacity] */
const FAN_BANDS: [number, number, number][] = [
  [0, 100, 0.08],
  [5, 95, 0.15],
  [25, 75, 0.25],
  [40, 60, 0.40],
];

const PERCENTILE_OPTIONS = [
  { value: '5', label: '5th percentile' },
  { value: '25', label: '25th percentile' },
  { value: '50', label: '50th (median)' },
  { value: '75', label: '75th percentile' },
  { value: '95', label: '95th percentile' },
];

/** Check if all values in an array are zero (or close to zero). */
function allZero(arr: number[]): boolean {
  return arr.every((v) => Math.abs(v) < 0.01);
}

/** Build fan chart datasets from FanData with a given color. */
function buildFanDatasets(
  fan: FanData,
  baseColor: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  const percentileMap: Record<string, number[]> = {
    '0': fan.p0,
    '5': fan.p5,
    '25': fan.p25,
    '40': fan.p40,
    '50': fan.p50,
    '60': fan.p60,
    '75': fan.p75,
    '95': fan.p95,
    '100': fan.p100,
  };

  // Parse base color rgb values
  const rgbMatch = baseColor.match(/rgba?\((\d+),(\d+),(\d+)/);
  const r = rgbMatch ? parseInt(rgbMatch[1]) : 76;
  const g = rgbMatch ? parseInt(rgbMatch[2]) : 110;
  const b = rgbMatch ? parseInt(rgbMatch[3]) : 245;

  for (const [lower, upper, opacity] of FAN_BANDS) {
    const lowerData = percentileMap[String(lower)];
    const upperData = percentileMap[String(upper)];
    if (!lowerData || !upperData) continue;

    const lowerIndex = result.length;

    result.push({
      label: `p${lower}`,
      data: lowerData,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 0,
      borderWidth: 0,
      fill: false,
      percentile: lower,
      isBandBound: true,
    });

    result.push({
      label: `p${upper}`,
      data: upperData,
      borderColor: 'transparent',
      backgroundColor: `rgba(${r},${g},${b},${opacity})`,
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 0,
      borderWidth: 0,
      fill: {
        target: lowerIndex,
        above: `rgba(${r},${g},${b},${opacity})`,
        below: `rgba(${r},${g},${b},${opacity})`,
      },
      percentile: upper,
      isBandBound: true,
    });
  }

  // Median line
  result.push({
    label: 'Median',
    data: fan.p50,
    borderColor: `rgba(${r},${g},${b},1)`,
    backgroundColor: 'transparent',
    pointRadius: 0,
    pointHoverRadius: 3,
    pointHitRadius: 10,
    borderWidth: 2,
    fill: false,
    percentile: 50,
    isMedian: true,
  });

  return result;
}

function BreakdownChart({
  showReal,
  simulationId,
}: {
  showReal: boolean;
  simulationId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectIncomeExpenseData);
  const [percentile, setPercentile] = useState<string>('50');

  const handlePercentileChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      setPercentile(value);
      dispatch(loadIncomeExpense(simulationId, Number(value)));
    },
    [dispatch, simulationId],
  );

  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    const breakdown = showReal ? data.realBreakdown : data.breakdown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datasets: any[] = [];
    let colorIdx = 0;

    // Income sources (positive, stacked above zero)
    for (const [source, values] of Object.entries(breakdown.income)) {
      if (allZero(values)) continue;
      datasets.push({
        label: source,
        data: values,
        backgroundColor: PALETTE[colorIdx % PALETTE.length] + 'B0',
        borderColor: PALETTE[colorIdx % PALETTE.length],
        borderWidth: 1,
        fill: 'origin',
        stack: 'income',
        pointRadius: 0,
        pointHoverRadius: 3,
      });
      colorIdx++;
    }

    // Expense categories (negated, stacked below zero)
    for (const [category, values] of Object.entries(breakdown.expenses)) {
      if (allZero(values)) continue;
      datasets.push({
        label: category,
        data: values.map((v) => -v),
        backgroundColor: PALETTE[colorIdx % PALETTE.length] + 'B0',
        borderColor: PALETTE[colorIdx % PALETTE.length],
        borderWidth: 1,
        fill: 'origin',
        stack: 'expenses',
        pointRadius: 0,
        pointHoverRadius: 3,
      });
      colorIdx++;
    }

    return { labels: data.labels, datasets };
  }, [data, showReal]);

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          type: 'category' as const,
          grid: { display: false },
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value: string | number) => formatDollar(Number(value)),
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            font: { size: 10 },
          },
        },
        tooltip: {
          enabled: true,
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label(item: TooltipItem<'line'>) {
              const val = item.raw as number;
              return `${item.dataset.label}: ${formatDollarFull(val)}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <Stack style={{ flex: 1, minHeight: 0 }} gap="xs">
      <Select
        label="Percentile"
        value={percentile}
        onChange={handlePercentileChange}
        data={PERCENTILE_OPTIONS}
        size="xs"
        style={{ maxWidth: 200 }}
      />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Line
            aria-label="Income and expense breakdown chart"
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
    </Stack>
  );
}

function IncomeFanChart({ showReal }: { showReal: boolean }) {
  const data = useSelector(selectIncomeExpenseData);

  const chartDatasets = useMemo(() => {
    if (!data) return [];
    const fan = showReal ? data.realIncomeFan : data.incomeFan;
    return buildFanDatasets(fan, 'rgba(81,207,102,1)');
  }, [data, showReal]);

  const labels = data?.labels ?? [];

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          type: 'category' as const,
          grid: { display: false },
        },
        y: {
          ticks: {
            callback: (value: string | number) => formatDollar(Number(value)),
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            title(items: TooltipItem<'line'>[]) {
              if (items.length === 0) return '';
              return items[0].label;
            },
            label() {
              return '';
            },
            afterBody(items: TooltipItem<'line'>[]) {
              if (items.length === 0) return [];
              const idx = items[0].dataIndex;
              const lines: string[] = [];
              const vals = new Map<number, number | null>();
              let medianVal: number | null = null;

              for (const item of items) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ds = item.dataset as any;
                const v = ds.data[idx];
                if (ds.isMedian) {
                  medianVal = v;
                } else if (ds.percentile != null) {
                  vals.set(ds.percentile, v);
                }
              }

              const bandPairs: [number, number][] = [
                [5, 95],
                [25, 75],
                [40, 60],
              ];
              for (const [lo, hi] of bandPairs) {
                const loVal = vals.get(lo);
                const hiVal = vals.get(hi);
                if (loVal != null && hiVal != null) {
                  lines.push(
                    `${lo}th-${hi}th: ${formatDollarFull(loVal)} - ${formatDollarFull(hiVal)}`,
                  );
                }
              }
              if (medianVal != null) {
                lines.push(`Median: ${formatDollarFull(medianVal)}`);
              }
              return lines;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Line
          aria-label="Income fan chart"
          data={{ datasets: chartDatasets, labels }}
          options={chartOptions}
        />
      </div>
    </div>
  );
}

function ExpenseFanChart({ showReal }: { showReal: boolean }) {
  const data = useSelector(selectIncomeExpenseData);

  const chartDatasets = useMemo(() => {
    if (!data) return [];
    const fan = showReal ? data.realExpenseFan : data.expenseFan;
    return buildFanDatasets(fan, 'rgba(255,107,107,1)');
  }, [data, showReal]);

  const labels = data?.labels ?? [];

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          type: 'category' as const,
          grid: { display: false },
        },
        y: {
          ticks: {
            callback: (value: string | number) => formatDollar(Number(value)),
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            title(items: TooltipItem<'line'>[]) {
              if (items.length === 0) return '';
              return items[0].label;
            },
            label() {
              return '';
            },
            afterBody(items: TooltipItem<'line'>[]) {
              if (items.length === 0) return [];
              const idx = items[0].dataIndex;
              const lines: string[] = [];
              const vals = new Map<number, number | null>();
              let medianVal: number | null = null;

              for (const item of items) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ds = item.dataset as any;
                const v = ds.data[idx];
                if (ds.isMedian) {
                  medianVal = v;
                } else if (ds.percentile != null) {
                  vals.set(ds.percentile, v);
                }
              }

              const bandPairs: [number, number][] = [
                [5, 95],
                [25, 75],
                [40, 60],
              ];
              for (const [lo, hi] of bandPairs) {
                const loVal = vals.get(lo);
                const hiVal = vals.get(hi);
                if (loVal != null && hiVal != null) {
                  lines.push(
                    `${lo}th-${hi}th: ${formatDollarFull(loVal)} - ${formatDollarFull(hiVal)}`,
                  );
                }
              }
              if (medianVal != null) {
                lines.push(`Median: ${formatDollarFull(medianVal)}`);
              }
              return lines;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Line
          aria-label="Expense fan chart"
          data={{ datasets: chartDatasets, labels }}
          options={chartOptions}
        />
      </div>
    </div>
  );
}

function IncomeExpense({ simulationId, showReal }: MCViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectIncomeExpenseData);
  const loaded = useSelector(selectIncomeExpenseLoaded);
  const error = useSelector(selectIncomeExpenseError);
  const showLoading = useDelayedLoading(!loaded);

  useEffect(() => {
    if (simulationId) {
      dispatch(loadIncomeExpense(simulationId, 50));
    }
  }, [dispatch, simulationId]);

  const summaryText = useMemo(() => {
    if (!data) return '';
    const summary = showReal ? data.realSummary : data.summary;
    const cumulative = summary.cumulativeNetCashFlow;
    return `Net cash flow (final year): median ${formatDollarFull(cumulative.median)} (5th: ${formatDollarFull(cumulative.p5)}, 95th: ${formatDollarFull(cumulative.p95)})`;
  }, [data, showReal]);

  if (showLoading) {
    return <Skeleton height="100%" width="100%" animate />;
  }

  if (error) {
    return (
      <Alert color="red" title="Error">
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Stack h="100%" justify="center" align="center">
        <Text c="dimmed">No income/expense data</Text>
      </Stack>
    );
  }

  return (
    <Stack style={{ flex: 1, minHeight: 0 }} aria-busy={showLoading}>
      <VisuallyHidden>
        Income and expense breakdown with fan charts showing uncertainty.
      </VisuallyHidden>
      <Tabs
        defaultValue="breakdown"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
      >
        <Tabs.List>
          <Tabs.Tab value="breakdown">Breakdown</Tabs.Tab>
          <Tabs.Tab value="income-fan">Income Fan</Tabs.Tab>
          <Tabs.Tab value="expense-fan">Expense Fan</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="breakdown"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <BreakdownChart showReal={showReal} simulationId={simulationId} />
        </Tabs.Panel>
        <Tabs.Panel
          value="income-fan"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <IncomeFanChart showReal={showReal} />
        </Tabs.Panel>
        <Tabs.Panel
          value="expense-fan"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <ExpenseFanChart showReal={showReal} />
        </Tabs.Panel>
      </Tabs>
      {summaryText && (
        <Text size="xs" c="dimmed" ta="center">
          {summaryText}
        </Text>
      )}
    </Stack>
  );
}

registerView({
  id: 'income-expense',
  title: 'Income & Expenses',
  component: IncomeExpense,
  columns: 3,
});

export default IncomeExpense;
