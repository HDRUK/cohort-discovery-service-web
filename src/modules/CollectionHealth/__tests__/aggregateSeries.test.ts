import { CollectionHealthSeries, PingBin } from "@/types/api";
import {
  AggregateEntry,
  buildAggregateSeries,
  PING_TASK_TYPES,
  seriesKey,
  servedTo,
} from "../aggregateSeries";

const BINS = ["2026-09-02T10:00:00Z", "2026-09-02T10:10:00Z"];

const pingBin = (start: string, perMinute: number | null): PingBin => ({
  bin: start,
  n: perMinute === null ? 0 : Math.round(perMinute * 10),
  minutes: 10,
  silent_minutes: perMinute === null ? 10 : 0,
  per_minute: perMinute,
});

const health = (
  rates: { a: (number | null)[]; b: (number | null)[] },
  bins = BINS,
): CollectionHealthSeries =>
  ({
    collection_id: 1,
    bin: "10m",
    from: bins[0],
    to: "2026-09-02T10:20:00Z",
    summary: {},
    series: {
      a: bins.map((start, index) => pingBin(start, rates.a[index] ?? null)),
      b: bins.map((start, index) => pingBin(start, rates.b[index] ?? null)),
    },
  }) as CollectionHealthSeries;

const entry = (
  pid: string,
  name: string,
  colour: string,
  series: CollectionHealthSeries | null,
): AggregateEntry => ({ pid, name, colour, health: series });

const BARTS = entry("p1", "Barts", "#2a78d6", health({ a: [3, 4], b: [1, 0] }));
const LEEDS = entry("p2", "Leeds", "#eb6834", health({ a: [5, 6], b: [2, 2] }));
const OXFORD = entry(
  "p3",
  "Oxford",
  "#1baf7a",
  health({ a: [7, 8], b: [3, 3] }),
);

describe("buildAggregateSeries", () => {
  it("produces one series per collection per requested task type", () => {
    const { series } = buildAggregateSeries(
      [BARTS, LEEDS, OXFORD],
      PING_TASK_TYPES,
      "10m",
    );

    expect(series).toHaveLength(6);
    expect(series.map((entry) => entry.key)).toEqual([
      "p1::a",
      "p1::b",
      "p2::a",
      "p2::b",
      "p3::a",
      "p3::b",
    ]);
  });

  it("keeps every series index-aligned with the labels", () => {
    const { labels, series } = buildAggregateSeries(
      [BARTS, LEEDS],
      PING_TASK_TYPES,
      "10m",
    );

    expect(labels).toHaveLength(BINS.length);
    series.forEach((entry) => expect(entry.data).toHaveLength(labels.length));
  });

  it("dashes the B-type series and leaves A-type solid", () => {
    const { series } = buildAggregateSeries([BARTS], PING_TASK_TYPES, "10m");

    expect(series[0]).toMatchObject({ key: "p1::a", dashed: false });
    expect(series[1]).toMatchObject({ key: "p1::b", dashed: true });
  });

  it("gives both of a collection's series its single colour", () => {
    const { series } = buildAggregateSeries([BARTS], PING_TASK_TYPES, "10m");

    expect(series.map((entry) => entry.colour)).toEqual(["#2a78d6", "#2a78d6"]);
  });

  it("halves the series when only one task type is asked for", () => {
    const { series } = buildAggregateSeries([BARTS, LEEDS], ["a"], "10m");

    expect(series.map((entry) => entry.key)).toEqual(["p1::a", "p2::a"]);
  });

  it("drops a collection that failed to load without shifting the others", () => {
    const failed = entry("p9", "Broken", "#e34948", null);
    const { series } = buildAggregateSeries(
      [BARTS, failed, LEEDS],
      ["a"],
      "10m",
    );

    expect(series.map((entry) => entry.key)).toEqual(["p1::a", "p2::a"]);
  });

  it("drops a response whose bins do not line up rather than misaligning the axis", () => {
    const shortBins = entry(
      "p4",
      "Cardiff",
      "#eda100",
      health({ a: [1], b: [1] }, [BINS[0]]),
    );

    const { labels, series } = buildAggregateSeries(
      [BARTS, shortBins],
      ["a"],
      "10m",
    );

    expect(labels).toHaveLength(2);
    expect(series.map((entry) => entry.key)).toEqual(["p1::a"]);
  });

  it("returns nothing when no collection loaded", () => {
    expect(
      buildAggregateSeries(
        [entry("p9", "Broken", "#e34948", null)],
        PING_TASK_TYPES,
        "10m",
      ),
    ).toEqual({ labels: [], series: [], binStarts: [] });
  });

  it("returns nothing for no collections at all", () => {
    expect(buildAggregateSeries([], PING_TASK_TYPES, "10m")).toEqual({
      labels: [],
      series: [],
      binStarts: [],
    });
  });

  it("nulls a zero rate so a silent host reads as a gap", () => {
    const { series } = buildAggregateSeries([BARTS], ["b"], "10m");

    expect(series[0].data).toEqual([1, null]);
  });

  it("names the collection and task type in the tooltip", () => {
    const { series } = buildAggregateSeries([BARTS], ["a"], "10m");

    expect(series[0].valueFormatter?.(3, 0)).toContain("Barts");
    expect(series[0].valueFormatter?.(3, 0)).toContain("A-type");
  });

  it("exposes the bin starts so a drag can be turned back into a range", () => {
    const { binStarts } = buildAggregateSeries([BARTS], ["a"], "10m");

    expect(binStarts).toEqual(BINS);
  });
});

describe("seriesKey", () => {
  it("keys on the pid and task type", () => {
    expect(seriesKey("p1", "b")).toBe("p1::b");
  });
});

describe("servedTo", () => {
  it("takes the served end from the first collection that loaded", () => {
    expect(servedTo([entry("p9", "Broken", "#e34948", null), BARTS])).toBe(
      "2026-09-02T10:20:00Z",
    );
  });

  it("is null when nothing loaded", () => {
    expect(servedTo([entry("p9", "Broken", "#e34948", null)])).toBeNull();
  });
});
