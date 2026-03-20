import type { ChartDataset, TooltipItem } from 'chart.js';
import type { FanData } from '../../types/types';

/** Format a dollar value with full precision (e.g. $1,234,567). */
export function formatDollarFull(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Format a dollar value with K/M/B suffixes. */
export function formatDollar(value: number): string {
  const neg = value < 0;
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = `$${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `$${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `$${(abs / 1_000).toFixed(0)}K`;
  } else {
    formatted = `$${abs.toFixed(0)}`;
  }
  return neg ? `-${formatted}` : formatted;
}

/* ------------------------------------------------------------------ */
/*  Shared fan chart types and builders                                */
/* ------------------------------------------------------------------ */

/** Typed dataset with fan chart metadata (avoids `any` casts). */
export interface FanDataset extends ChartDataset<'line', (number | null)[]> {
  percentile?: number;
  isMedian?: boolean;
  isBandBound?: boolean;
  isDeterministic?: boolean;
}

/** Band definitions: [lowerPercentile, upperPercentile, opacity] */
export const FAN_BANDS: [number, number, number][] = [
  [0, 100, 0.08],
  [5, 95, 0.15],
  [25, 75, 0.25],
  [40, 60, 0.40],
];

/** Build fan chart datasets from FanData with a given base color. */
export function buildFanDatasets(
  fan: FanData,
  baseColor: string,
): FanDataset[] {
  const result: FanDataset[] = [];
  const percentileMap: Record<string, number[]> = {
    '0': fan.p0,
    '5': fan.p5,
    '25': fan.p25,
    '40': fan.p40,
    '50': fan.p50,
    '60': fan.p60,
    '75': fan.p75,
    '95': fan.p95,
    '100': fan.p100,
  };

  // Parse base color rgb values
  const rgbMatch = baseColor.match(/rgba?\((\d+),(\d+),(\d+)/);
  const r = rgbMatch ? parseInt(rgbMatch[1]) : 76;
  const g = rgbMatch ? parseInt(rgbMatch[2]) : 110;
  const b = rgbMatch ? parseInt(rgbMatch[3]) : 245;

  for (const [lower, upper, opacity] of FAN_BANDS) {
    const lowerData = percentileMap[String(lower)];
    const upperData = percentileMap[String(upper)];
    if (!lowerData || !upperData) continue;

    const lowerIndex = result.length;

    result.push({
      label: `p${lower}`,
      data: lowerData,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 0,
      borderWidth: 0,
      fill: false,
      percentile: lower,
      isBandBound: true,
    });

    result.push({
      label: `p${upper}`,
      data: upperData,
      borderColor: 'transparent',
      backgroundColor: `rgba(${r},${g},${b},${opacity})`,
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 0,
      borderWidth: 0,
      fill: {
        target: lowerIndex,
        above: `rgba(${r},${g},${b},${opacity})`,
        below: `rgba(${r},${g},${b},${opacity})`,
      },
      percentile: upper,
      isBandBound: true,
    });
  }

  // Median line
  result.push({
    label: 'Median',
    data: fan.p50,
    borderColor: `rgba(${r},${g},${b},1)`,
    backgroundColor: 'transparent',
    pointRadius: 0,
    pointHoverRadius: 3,
    pointHitRadius: 10,
    borderWidth: 2,
    fill: false,
    percentile: 50,
    isMedian: true,
  });

  return result;
}

/** Build shared fan chart options. */
export function buildFanChartOptions(): object {
  return {
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
          label() {
            return '';
          },
          afterBody(items: TooltipItem<'line'>[]) {
            if (items.length === 0) return [];
            const idx = items[0].dataIndex;
            const lines: string[] = [];
            const vals = new Map<number, number | null>();
            let medianVal: number | null = null;

            for (const item of items) {
              const ds = item.dataset as FanDataset;
              const v = ds.data[idx];
              if (ds.isMedian) {
                medianVal = v;
              } else if (ds.percentile != null) {
                vals.set(ds.percentile, v);
              }
            }

            // Band ranges (outer to inner), including 0-100
            const bandPairs: [number, number][] = [
              [0, 100],
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
            return lines;
          },
        },
      },
    },
  };
}

/** Stable empty labels array to avoid new-reference re-renders. */
export const EMPTY_LABELS: string[] = [];
