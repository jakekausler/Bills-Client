import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectMoneyMovementLabels,
  selectMoneyMovementDatasets,
} from '../../features/moneyMovement/select';
import { Bar } from 'react-chartjs-2';
import { Stack, VisuallyHidden } from '@mantine/core';

export function MoneyMovement() {
  const labels = useSelector(selectMoneyMovementLabels);
  const datasets = useSelector(selectMoneyMovementDatasets);
  return (
    <Stack h="100%">
      <VisuallyHidden component="h2">Money Movement</VisuallyHidden>
      <div role="img" aria-label="Stacked bar chart showing money movement across accounts over time. Tooltip details are available via mouse hover.">
        <Bar
          data={{ labels, datasets: datasets ?? [] }}
          options={{
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          }}
        />
      </div>
    </Stack>
  );
}
