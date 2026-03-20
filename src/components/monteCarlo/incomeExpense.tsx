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
import {
  buildFanChartOptions,
  buildFanDatasets,
  EMPTY_LABELS,
  FanDataset,
  formatDollar,
  formatDollarFull,
} from './utils';
import type { FanData, IncomeExpenseData } from '../../types/types';

Chart.register(...registerables);

/** 20 distinct categorical colors for stacked area series. */
const PALETTE = [
  '#4c6ef5', '#51cf66', '#fcc419', '#ff6b6b', '#845ef7',
  '#22b8cf', '#ff922b', '#20c997', '#e64980', '#adb5bd',
  '#5c7cfa', '#94d82d', '#fab005', '#f06595', '#7950f2',
  '#15aabf', '#fd7e14', '#12b886', '#e8590c', '#868e96',
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

/* ------------------------------------------------------------------ */
/*  Shared FanChartPanel — used by both Income and Expense fan tabs    */
/* ------------------------------------------------------------------ */

function FanChartPanel({
  data,
  showReal,
  fanKey,
  realFanKey,
  color,
  ariaLabel,
}: {
  data: IncomeExpenseData | null;
  showReal: boolean;
  fanKey: 'incomeFan' | 'expenseFan';
  realFanKey: 'realIncomeFan' | 'realExpenseFan';
  color: string;
  ariaLabel: string;
}) {
  const fanRecord = data ? (showReal ? data[realFanKey] : data[fanKey]) : null;

  // Build category options for the dropdown
  const categoryOptions = useMemo(() => {
    if (!fanRecord) return [];
    return Object.keys(fanRecord).map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [fanRecord]);

  const [selectedCategory, setSelectedCategory] = useState<string>('Total');

  // Reset to Total when data changes (e.g., switching nominal/real)
  useEffect(() => {
    if (fanRecord && !fanRecord[selectedCategory]) {
      setSelectedCategory('Total');
    }
  }, [fanRecord, selectedCategory]);

  const chartDatasets = useMemo(() => {
    if (!fanRecord) return [];
    const fan: FanData = (fanRecord[selectedCategory] ?? fanRecord['Total']) as FanData;
    if (!fan) return [];
    return buildFanDatasets(fan, color);
  }, [fanRecord, selectedCategory, color]);

  const labels = data?.labels ?? EMPTY_LABELS;

  const chartData = useMemo(
    () => ({ datasets: chartDatasets, labels }),
    [chartDatasets, labels],
  );

  return (
    <Stack style={{ flex: 1, minHeight: 0 }} gap="xs">
      <Select
        label="Category"
        value={selectedCategory}
        onChange={(val) => val && setSelectedCategory(val)}
        data={categoryOptions}
        size="xs"
        style={{ maxWidth: 250 }}
      />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Line
            aria-label={ariaLabel}
            data={chartData}
            options={FAN_CHART_OPTIONS}
          />
        </div>
      </div>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Module-level constants (static — no deps)                          */
/* ------------------------------------------------------------------ */

/** Shared fan chart options (static, no deps). */
const FAN_CHART_OPTIONS = buildFanChartOptions() as Parameters<typeof Line>[0]['options'];

/** Static breakdown chart options. */
const BREAKDOWN_CHART_OPTIONS: Parameters<typeof Line>[0]['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      type: 'category' as const,
      stacked: true,
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
          return `${item.dataset.label}: ${formatDollarFull(Math.abs(val))}`;
        },
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  BreakdownChart                                                     */
/* ------------------------------------------------------------------ */

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
    if (!data) return { labels: EMPTY_LABELS, datasets: [] };

    const breakdown = showReal ? data.realBreakdown : data.breakdown;
    const datasets: FanDataset[] = [];
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
      {/* Spec-8: Brief skeleton flash on percentile change is acceptable UX;
          the data round-trip is fast enough that adding transition logic
          would add complexity without meaningful benefit. */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Line
            aria-label="Income and expense breakdown chart"
            data={chartData}
            options={BREAKDOWN_CHART_OPTIONS}
          />
        </div>
      </div>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Main IncomeExpense view                                            */
/* ------------------------------------------------------------------ */

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
    return `Cumulative net cash flow: median ${formatDollarFull(cumulative.median)} (5th: ${formatDollarFull(cumulative.p5)}, 95th: ${formatDollarFull(cumulative.p95)})`;
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
    <Stack style={{ flex: 1, minHeight: 0 }} role="region" aria-busy={showLoading}>
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
          aria-label="Income and expense breakdown"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <BreakdownChart showReal={showReal} simulationId={simulationId} />
        </Tabs.Panel>
        <Tabs.Panel
          value="income-fan"
          aria-label="Income fan chart"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <FanChartPanel
            data={data}
            showReal={showReal}
            fanKey="incomeFan"
            realFanKey="realIncomeFan"
            color="rgba(81,207,102,1)"
            ariaLabel="Income fan chart"
          />
        </Tabs.Panel>
        <Tabs.Panel
          value="expense-fan"
          aria-label="Expense fan chart"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <FanChartPanel
            data={data}
            showReal={showReal}
            fanKey="expenseFan"
            realFanKey="realExpenseFan"
            color="rgba(255,107,107,1)"
            ariaLabel="Expense fan chart"
          />
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
