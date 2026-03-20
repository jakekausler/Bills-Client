import React, { useEffect } from 'react';
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
    return null;
  }

  const { histogram, summary } = data;
  const totalSimulations = summary.totalSimulations;

  const chartData = {
    labels: histogram.map((h) => h.year),
    datasets: [
      {
        label: 'Failures',
        data: histogram.map((h) => h.count),
        backgroundColor: '#ff6b6b',
        borderColor: '#ff6b6b',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false as const,
    responsive: true as const,
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Year',
          color: '#aaa',
        },
        ticks: {
          color: '#aaa',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#aaa',
          callback: (value: string | number) => Math.floor(Number(value)),
        },
        title: {
          display: true,
          text: 'Failures',
          color: '#aaa',
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
            const pct = ((count / totalSimulations) * 100).toFixed(1);
            return `Year ${item.label}: ${count} failures (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <Stack h="100%" gap="xs">
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Bar
            aria-label="Failure year distribution histogram"
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
      <div style={{ padding: '0 8px 4px' }}>
        {summary.failedSimulations > 0 ? (
          <Text size="sm" c="dimmed" ta="center">
            Median failure: {summary.medianFailureYear}, Earliest:{' '}
            {summary.earliestFailureYear}, {summary.failedSimulations} of{' '}
            {summary.totalSimulations} failed
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
