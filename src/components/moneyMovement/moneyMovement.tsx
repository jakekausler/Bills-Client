import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectMoneyMovementLabels,
  selectMoneyMovementDatasets,
  selectMoneyMovementStartDate,
  selectMoneyMovementEndDate,
} from '../../features/moneyMovement/select';
import { Bar } from 'react-chartjs-2';

export function MoneyMovement() {
  const labels = useSelector(selectMoneyMovementLabels);
  const datasets = useSelector(selectMoneyMovementDatasets);
  const startDate = useSelector(selectMoneyMovementStartDate);
  const endDate = useSelector(selectMoneyMovementEndDate);
  return (
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
  );
}
