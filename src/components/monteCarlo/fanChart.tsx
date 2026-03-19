import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton, Stack, VisuallyHidden } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
  selectMonteCarloDatasets,
  selectMonteCarloLabels,
  selectMonteCarloLoaded,
} from '../../features/monteCarlo/select';
import { MCViewProps, registerView } from './viewRegistry';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { PercentileDataset } from '../../types/types';
import { formatDollar } from './utils';

Chart.register(...registerables);

/** Band definitions: [lowerPercentile, upperPercentile, opacity] */
const BANDS: [number, number, number][] = [
  [0, 100, 0.08],
  [5, 95, 0.15],
  [25, 75, 0.25],
  [40, 60, 0.40],
];

function formatDollarFull(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function getValues(ds: PercentileDataset, showReal: boolean): (number | null)[] {
  const raw = showReal && ds.realValues ? ds.realValues : ds.data;
  return raw.map((d, i) =>
    d === 0 &&
    (i === 0 || raw[i - 1] === 0) &&
    (i === raw.length - 1 || raw[i + 1] === 0)
      ? null
      : d,
  );
}

function FanChart({ showReal, showDeterministic }: MCViewProps) {
  const allDatasets = useSelector(selectMonteCarloDatasets);
  const labels = useSelector(selectMonteCarloLabels);
  const loaded = useSelector(selectMonteCarloLoaded);
  const showLoading = useDelayedLoading(!loaded);

  // Build a map: percentile -> dataset, and find deterministic
  const byPercentile = useMemo(() => {
    const map = new Map<number, PercentileDataset>();
    let det: PercentileDataset | null = null;
    for (const ds of allDatasets) {
      if (ds.isDeterministic) {
        det = ds;
      } else if (ds.percentile != null) {
        map.set(ds.percentile, ds);
      }
    }
    return { map, det };
  }, [allDatasets]);

  // Build Chart.js datasets: bands (lower first, then upper with fill to lower) + median + deterministic
  const chartDatasets = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = [];
    const { map, det } = byPercentile;

    // For each band, we add the lower line then the upper line.
    // The upper line fills down to the lower line using fill: { target: index }.
    for (const [lower, upper, opacity] of BANDS) {
      const lowerDs = map.get(lower);
      const upperDs = map.get(upper);
      if (!lowerDs || !upperDs) continue;

      const lowerIndex = result.length;

      // Lower bound line (invisible)
      result.push({
        label: `p${lower}`,
        data: getValues(lowerDs, showReal),
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        borderWidth: 0,
        fill: false,
        // Store percentile for tooltip
        percentile: lower,
        isBandBound: true,
      });

      // Upper bound line fills to the lower bound
      result.push({
        label: `p${upper}`,
        data: getValues(upperDs, showReal),
        borderColor: 'transparent',
        backgroundColor: `rgba(76,110,245,${opacity})`,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        borderWidth: 0,
        fill: { target: lowerIndex, above: `rgba(76,110,245,${opacity})`, below: `rgba(76,110,245,${opacity})` },
        percentile: upper,
        isBandBound: true,
      });
    }

    // Median line
    const medianDs = map.get(50);
    if (medianDs) {
      result.push({
        label: 'Median',
        data: getValues(medianDs, showReal),
        borderColor: '#4c6ef5',
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHitRadius: 10,
        borderWidth: 2,
        fill: false,
        percentile: 50,
        isMedian: true,
      });
    }

    // Deterministic line
    if (det && showDeterministic) {
      result.push({
        label: 'Deterministic',
        data: getValues(det, showReal),
        borderColor: '#ff6b6b',
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHitRadius: 10,
        borderWidth: 2,
        fill: false,
        isDeterministic: true,
      });
    }

    return result;
  }, [byPercentile, showReal, showDeterministic]);

  if (showLoading) {
    return <Skeleton height="100%" width="100%" animate />;
  }

  if (allDatasets.length === 0) {
    return null;
  }

  return (
    <Stack pos="relative" h="100%" aria-busy={showLoading}>
      <div
        style={{ position: 'relative', flex: 1, minHeight: 0 }}
        role="img"
        aria-label="Fan chart showing Monte Carlo percentile bands over time."
      >
        <VisuallyHidden>
          Fan chart with percentile bands. Data values are shown in tooltips on hover.
        </VisuallyHidden>
        <div style={{ position: 'absolute', inset: 0 }}>
        <Line
          aria-label="Monte Carlo fan chart"
          data={{ datasets: chartDatasets, labels }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            scales: {
              x: {
                type: 'category',
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
                mode: 'index',
                intersect: false,
                filter: () => true,
                callbacks: {
                  title(items: TooltipItem<'line'>[]) {
                    if (items.length === 0) return '';
                    return items[0].label;
                  },
                  label() {
                    // Suppress individual dataset labels — we build the body in afterBody
                    return '';
                  },
                  afterBody(items: TooltipItem<'line'>[]) {
                    if (items.length === 0) return [];
                    const idx = items[0].dataIndex;
                    const lines: string[] = [];

                    // Gather values by percentile from the raw datasets
                    const vals = new Map<number, number | null>();
                    let detVal: number | null = null;
                    let medianVal: number | null = null;

                    for (const item of items) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const ds = item.dataset as any;
                      const v = ds.data[idx];
                      if (ds.isDeterministic) {
                        detVal = v;
                      } else if (ds.isMedian) {
                        medianVal = v;
                      } else if (ds.percentile != null) {
                        vals.set(ds.percentile, v);
                      }
                    }

                    // Band ranges (outer to inner)
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
                    if (detVal != null) {
                      lines.push(`Deterministic: ${formatDollarFull(detVal)}`);
                    }

                    return lines;
                  },
                },
              },
            },
          }}
        />
        </div>
      </div>
    </Stack>
  );
}

registerView({
  id: 'fan-chart',
  title: 'Portfolio Projection',
  component: FanChart,
  columns: 3,
});

export default FanChart;
