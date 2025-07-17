import React from 'react';
import { Stack, LoadingOverlay, Group } from '@mantine/core';
import { GraphProps } from './types';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import { useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';

Chart.register(...registerables);

export function Graph({
  style,
  datasets,
  labels,
  type,
  startDate,
  endDate,
  loaded,
  setGraphStartDate,
  setGraphEndDate,
}: GraphProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !loaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loaded]);

  return (
    <Stack pos="relative" h="100%" style={style}>
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Group w="100%">
        <EditableDateInput
          style={{ flex: 1 }}
          value={startDate}
          onBlur={(value) => {
            if (!value) return;
            dispatch(setGraphStartDate(value));
          }}
          label="Graph Start Date"
          placeholder="Select start date"
        />
        <EditableDateInput
          style={{ flex: 1 }}
          value={endDate}
          onBlur={(value) => {
            if (!value) return;
            dispatch(setGraphEndDate(value));
          }}
          label="Graph End Date"
          placeholder="Select end date"
        />
      </Group>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Line
          data={{
            datasets: datasets.map((dataset, index) => ({
              // borderColor: `hsl(${(index * 137.5 + 200) % 360}, 70%, 50%)`,
              // backgroundColor: `hsla(${(index * 137.5 + 200) % 360}, 70%, 50%, 0.5)`,
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
                type: 'time',
                time: {
                  unit: 'month',
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              tooltip: {
                enabled: true,
                displayColors: false,
                callbacks:
                  type === 'activity'
                    ? {
                        title: function (context: any) {
                          if (context.length > 0) {
                            let datasetLabel = '';
                            if (datasets.length > 1) {
                              datasetLabel = datasets[context[0].datasetIndex].label + '\n';
                            }
                            return (
                              datasetLabel +
                              new Date(context[0].label).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            );
                          }
                        },
                        label: function (context: any) {
                          return [
                            ...context.dataset.activity[context.dataIndex].map((t: any) => {
                              return `${t.name}: $ ${t.amount.toLocaleString('en-US')}`;
                            }),
                          ];
                        },
                        footer: function (context: any) {
                          return context
                            .map((t: any) => {
                              return (
                                `Balance: $ ${t.dataset.data[t.dataIndex].toLocaleString('en-US')}` +
                                (context.length > 1 ? ` (${t.dataset.label})` : '')
                              );
                            })
                            .join(', ');
                        },
                      }
                    : type === 'monteCarlo'
                      ? {
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
                        }
                      : {
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
