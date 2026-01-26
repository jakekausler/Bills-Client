import React from 'react';
import { LineChart } from '@mantine/charts';
import { Box, Text } from '@mantine/core';

type Props = {
  data: { date: string; value: number }[];
  limit: number;
  color: string;
  height?: number;
};

export default function ProgressMiniGraph({ data, limit, color, height = 120 }: Props) {
  if (data.length === 0) {
    return (
      <Text size="xs" c="dimmed" ta="center" py="xs">
        No data available
      </Text>
    );
  }

  const chartData = data.map(d => ({
    date: d.date.slice(5), // Show MM-DD format
    value: d.value,
    limit: limit,
  }));

  return (
    <Box mt="xs">
      <LineChart
        h={height}
        data={chartData}
        dataKey="date"
        series={[
          { name: 'value', color: color },
          { name: 'limit', color: 'red.3', strokeDasharray: '5 5' },
        ]}
        curveType="monotone"
        withLegend={false}
        withDots={false}
        gridAxis="none"
        tickLine="none"
        withYAxis={false}
        withXAxis={true}
        xAxisProps={{ tickSize: 0, padding: { left: 10, right: 10 } }}
      />
    </Box>
  );
}
