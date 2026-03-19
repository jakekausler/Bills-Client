import React from 'react';
import { Stack, LoadingOverlay, VisuallyHidden } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { PercentileDataset } from '../../types/types';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

Chart.register(...registerables);

interface MonteCarloChartProps {
  datasets: PercentileDataset[];
  labels: string[];
  loaded: boolean;
  style?: React.CSSProperties;
}

export function MonteCarloChart({
  datasets,
  labels,
  loaded,
  style,
}: MonteCarloChartProps) {
  const showLoading = useDelayedLoading(!loaded);

  return (
    <Stack pos="relative" h="100%" style={style} aria-busy={showLoading}>
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <div
        style={{ flex: 1, minHeight: 0 }}
        role="img"
        aria-label="Line chart showing Monte Carlo simulation results over time. Tooltip details are available via mouse hover."
      >
        <VisuallyHidden>Monte Carlo simulation chart. Data values are shown in tooltips on hover.</VisuallyHidden>
        <Line
          aria-label="Monte Carlo simulation chart"
          data={{
            datasets: datasets.map((dataset) => ({
              pointRadius: 0,
              borderWidth: 1,
              pointHoverRadius: 5,
              pointHitRadius: 10,
              ...dataset,
              // Display 0s as null so they don't show up in the graph
              // Only display 0s if they are used in a line from 0 to somewhere else
              // In essence, this removes lines that go from 0 to 0
              data: dataset.data.map((d, i) =>
                d === 0 &&
                (i === 0 || dataset.data[i - 1] === 0) &&
                (i === dataset.data.length - 1 || dataset.data[i + 1] === 0)
                  ? null
                  : d,
              ),
            })),
            labels,
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                type: 'category',
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                  title: function (context: any) {
                    let datasetLabel = '';
                    if (datasets.length > 1) {
                      datasetLabel = datasets[context[0].datasetIndex].label + '\n';
                    }
                    if (context.length > 0) {
                      return (
                        datasetLabel +
                        new Date(context[0].label).toLocaleDateString('en-US', { year: 'numeric' })
                      );
                    }
                  },
                  label: function (context: any) {
                    return `$ ${context.dataset.data[context.dataIndex].toLocaleString('en-US')}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </Stack>
  );
}
