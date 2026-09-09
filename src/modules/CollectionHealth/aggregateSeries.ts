import { ChartSeries } from "@/components/MultiSeriesLineChart";
import { CollectionHealthSeries, PingBin } from "@/types/api";
import { formatBinLabel } from "./timeRange";

export type PingTaskType = "a" | "b";

export const PING_TASK_TYPES: PingTaskType[] = ["a", "b"];

export interface AggregateEntry {
  pid: string;
  name: string;
  colour: string;
  health: CollectionHealthSeries | null;
}

export const seriesKey = (pid: string, type: PingTaskType) => `${pid}::${type}`;

const toRates = (points: PingBin[]): (number | null)[] =>
  points.map((point) =>
    point.per_minute !== null && point.per_minute > 0 ? point.per_minute : null,
  );

const formatPoint = (
  name: string,
  type: PingTaskType,
  point: PingBin | undefined,
  value: number | null,
) => {
  const who = `${name} · ${type.toUpperCase()}-type`;
  if (!point) return `${who} — no data yet`;
  if (value === null) {
    return point.minutes === 0
      ? `${who} — no data yet`
      : `${who} — no pings · ${point.silent_minutes} min silent`;
  }

  return `${who} — ${value.toFixed(2)} /min · ${point.n.toLocaleString()} pings`;
};

export const buildAggregateSeries = (
  entries: AggregateEntry[],
  taskTypes: PingTaskType[],
  bin: string,
): { labels: string[]; series: ChartSeries[]; binStarts: string[] } => {
  const loaded = entries.filter(
    (entry): entry is AggregateEntry & { health: CollectionHealthSeries } =>
      entry.health !== null,
  );

  if (!loaded.length) return { labels: [], series: [], binStarts: [] };

  const binLength = Math.max(
    ...loaded.map((entry) => entry.health.series.a.length),
  );

  const aligned = loaded.filter(
    (entry) =>
      entry.health.series.a.length === binLength &&
      entry.health.series.b.length === binLength,
  );

  if (!aligned.length) return { labels: [], series: [], binStarts: [] };

  const binStarts = aligned[0].health.series.a.map((point) => point.bin);
  const labels = binStarts.map((start) => formatBinLabel(start, bin));

  const series = aligned.flatMap((entry) =>
    taskTypes.map((type) => {
      const points = entry.health.series[type];
      const rates = toRates(points);

      return {
        key: seriesKey(entry.pid, type),
        label: `${entry.name} · ${type.toUpperCase()}-type`,
        colour: entry.colour,
        data: rates,
        dashed: type === "b",
        showMark: (index: number) => rates[index] !== null,
        valueFormatter: (value: number | null, dataIndex: number) =>
          formatPoint(entry.name, type, points[dataIndex], value),
      };
    }),
  );

  return { labels, series, binStarts };
};

export const servedTo = (entries: AggregateEntry[]): string | null =>
  entries.find((entry) => entry.health !== null)?.health?.to ?? null;
