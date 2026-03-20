import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Skeleton, Stack, Text, VisuallyHidden } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
  selectWorstCases,
  selectWorstCasesLoaded,
  selectWorstCasesError,
} from '../../features/monteCarlo/select';
import { loadWorstCases } from '../../features/monteCarlo/actions';
import { MCViewProps, registerView } from './viewRegistry';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { AppDispatch } from '../../store';
import { formatDollar } from './utils';

Chart.register(...registerables);

const PERCENTILE = Math.max(1, Math.min(50, 5));

function formatDollarFull(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Generate a color with opacity interpolated between 0.9 (index 0) and 0.2 (last index). */
function simColor(index: number, total: number): string {
  const opacity = total <= 1 ? 0.9 : 0.9 - (0.7 * index) / (total - 1);
  return `rgba(255,107,107,${opacity.toFixed(2)})`;
}

function WorstCases({ simulationId, reportingAccount, showReal, showDeterministic }: MCViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectWorstCases);
  const loaded = useSelector(selectWorstCasesLoaded);
  const error = useSelector(selectWorstCasesError);
  const showLoading = useDelayedLoading(!loaded);

  useEffect(() => {
    if (simulationId) {
      dispatch(
        loadWorstCases(
          simulationId,
          PERCENTILE,
          reportingAccount ?? undefined,
        ),
      );
    }
  }, [dispatch, simulationId, reportingAccount]);

  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    const total = data.simulations.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datasets: any[] = data.simulations.map((sim, i) => ({
      label: `Sim #${sim.simulationNumber}`,
      data: showReal ? sim.realData : sim.data,
      borderColor: simColor(i, total),
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 3,
      pointHitRadius: 10,
      borderWidth: 2,
      fill: false,
      simNumber: sim.simulationNumber,
    }));

    if (showDeterministic && data.deterministic) {
      datasets.push({
        label: 'Deterministic',
        data: showReal ? data.deterministic.realData : data.deterministic.data,
        borderColor: '#ff6b6b',
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHitRadius: 10,
        borderWidth: 2,
        borderDash: [6, 3],
        fill: false,
        isDeterministic: true,
      });
    }

    return { labels: data.labels, datasets };
  }, [data, showReal, showDeterministic]);

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
            label(item: TooltipItem<'line'>) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const ds = item.dataset as any;
              const val = item.raw as number;
              if (ds.isDeterministic) {
                return `Deterministic: ${formatDollarFull(val)}`;
              }
              return `Sim #${ds.simNumber}: ${formatDollarFull(val)}`;
            },
          },
        },
      },
    }),
    [],
  );

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

  if (!data || data.simulations.length === 0) {
    return (
      <Stack h="100%" justify="center" align="center">
        <Text c="dimmed">No simulation data</Text>
      </Stack>
    );
  }

  return (
    <Stack pos="relative" h="100%" aria-busy={showLoading}>
      <div
        style={{ position: 'relative', flex: 1, minHeight: 0 }}
        role="img"
        aria-label="Worst-case simulation trajectories showing the bottom 5% of outcomes."
      >
        <VisuallyHidden>
          Line chart showing worst-case simulation paths. Data values are shown in tooltips on hover.
        </VisuallyHidden>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Line
            aria-label="Worst-case simulations chart"
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
    </Stack>
  );
}

registerView({
  id: 'worst-cases',
  title: 'Worst-Case Scenarios',
  component: WorstCases,
  columns: 2,
});

export default WorstCases;
