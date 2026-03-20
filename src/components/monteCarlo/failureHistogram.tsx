import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Skeleton, Stack, Text } from '@mantine/core';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
  selectFailureHistogram,
  selectFailureHistogramLoaded,
  selectFailureHistogramError,
} from '../../features/monteCarlo/select';
import { loadFailureHistogram } from '../../features/monteCarlo/actions';
import { MCViewProps, registerView } from './viewRegistry';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { AppDispatch } from '../../store';
import { IconCheck } from '@tabler/icons-react';

Chart.register(...registerables);

const FAILURE_COLOR = '#ff6b6b';
const AXIS_COLOR = '#aaa';

// reportingAccount, showReal, showDeterministic, graphData are not applicable to this view
// (failure is a portfolio-level event, not per-account, and uses counts not dollars)
function FailureHistogram({ simulationId }: MCViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectFailureHistogram);
  const loaded = useSelector(selectFailureHistogramLoaded);
  const error = useSelector(selectFailureHistogramError);
  const showLoading = useDelayedLoading(!loaded);

  useEffect(() => {
    if (simulationId) {
      dispatch(loadFailureHistogram(simulationId));
    }
  }, [dispatch, simulationId]);

  const histogram = data?.histogram;
  const summary = data?.summary;
  const totalSimulations = summary?.totalSimulations ?? 0;

  const chartData = useMemo(() => ({
    labels: (histogram ?? []).map((h) => h.year),
    datasets: [
      {
        label: 'Failures',
        data: (histogram ?? []).map((h) => h.count),
        backgroundColor: FAILURE_COLOR,
        borderColor: FAILURE_COLOR,
        borderWidth: 1,
      },
    ],
  }), [histogram]);

  const chartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Year',
          color: AXIS_COLOR,
        },
        ticks: {
          color: AXIS_COLOR,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: AXIS_COLOR,
          callback: (value: string | number) => Math.floor(Number(value)),
        },
        title: {
          display: true,
          text: 'Failures',
          color: AXIS_COLOR,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label(item: TooltipItem<'bar'>) {
            const count = item.raw as number;
            const pct = totalSimulations > 0 ? ((count / totalSimulations) * 100).toFixed(1) : '0.0';
            return `Year ${item.label}: ${count} failures (${pct}%)`;
          },
        },
      },
    },
  }), [totalSimulations]);

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

  if (!data || !summary) {
    return null;
  }

  return (
    <Stack h="100%" gap="xs" aria-busy={showLoading}>
      <div
        style={{ position: 'relative', flex: 1, minHeight: 0 }}
        role="img"
        aria-label="Failure year distribution histogram"
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Bar
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
      <div style={{ padding: '0 8px 4px' }}>
        {summary.failedSimulations > 0 ? (
          <Text size="sm" c="dimmed" ta="center">
            Median failure: {summary.medianFailureYear}, Earliest:{' '}
            {summary.earliestFailureYear}, Latest: {summary.latestFailureYear},{' '}
            {summary.failedSimulations} of {summary.totalSimulations} failed
          </Text>
        ) : (
          <Text size="sm" c="green" ta="center" fw={500}>
            <IconCheck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            No failures across {summary.totalSimulations} simulations
          </Text>
        )}
      </div>
    </Stack>
  );
}

registerView({
  id: 'failure-histogram',
  title: 'Failure Distribution',
  component: FailureHistogram,
  columns: 1,
});

export default FailureHistogram;
