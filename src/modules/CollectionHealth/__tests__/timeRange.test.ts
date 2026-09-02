import {
  autoBinWidth,
  binCount,
  binWidthMinutes,
  composeBinWidth,
  decomposeBinWidth,
  DEFAULT_BIN,
  DEFAULT_BIN_DRAFT,
  defaultRange,
  DEFAULT_RANGE_HOURS,
  TimeRange,
  isValidBinWidth,
  MAX_BINS,
  rangeFromBins,
  rangeMinutes,
  TARGET_BINS,
} from "../timeRange";

/** A range spanning `minutes`, anchored at a fixed instant. */
const spanOf = (minutes: number): TimeRange => ({
  from: "2026-09-02T00:00:00Z",
  to: new Date(Date.UTC(2026, 8, 2) + minutes * 60_000).toISOString(),
});

const customRange = (from: string, to: string): TimeRange => ({ from, to });

describe("binWidthMinutes", () => {
  it.each([
    ["minute", 1],
    ["hour", 60],
    ["day", 1440],
    ["week", 10080],
    ["month", 43200],
    ["10m", 10],
    ["30m", 30],
    ["6h", 360],
    ["2d", 2880],
    ["4w", 40320],
    ["1h", 60],
  ])("resolves %s to %s minutes", (bin, expected) => {
    expect(binWidthMinutes(bin)).toBe(expected);
  });

  it.each(["2mo", "0m", "-5m", "90s", "m", "", "abc"])("rejects %s", (bin) => {
    expect(binWidthMinutes(bin)).toBeNull();
  });
});

describe("isValidBinWidth", () => {
  it("accepts named units and multiples", () => {
    expect(isValidBinWidth("minute")).toBe(true);
    expect(isValidBinWidth("10m")).toBe(true);
  });

  it("rejects malformed widths", () => {
    expect(isValidBinWidth("2mo")).toBe(false);
    expect(isValidBinWidth("0m")).toBe(false);
  });
});

describe("composeBinWidth", () => {
  it("builds a bin string from a value and unit", () => {
    expect(composeBinWidth(45, "m")).toBe("45m");
    expect(composeBinWidth(6, "h")).toBe("6h");
  });
});

describe("defaultRange", () => {
  it("spans the last hour, ending now", () => {
    const range = defaultRange();

    expect(rangeMinutes(range)).toBe(DEFAULT_RANGE_HOURS * 60);
    expect(Date.parse(range.to)).toBeLessThanOrEqual(Date.now());
  });

  it("holds TARGET_BINS bins at the default width", () => {
    expect(binCount(DEFAULT_BIN, defaultRange())).toBe(TARGET_BINS);
  });
});

describe("rangeMinutes", () => {
  it("computes the span between two instants", () => {
    expect(
      rangeMinutes(customRange("2026-09-02T09:00:00Z", "2026-09-02T10:00:00Z")),
    ).toBe(60);
  });

  it("rejects a custom range where to is not after from", () => {
    expect(
      rangeMinutes(customRange("2026-09-02T10:00:00Z", "2026-09-02T09:00:00Z")),
    ).toBeNull();
    expect(
      rangeMinutes(customRange("2026-09-02T09:00:00Z", "2026-09-02T09:00:00Z")),
    ).toBeNull();
  });

  it("rejects invalid dates", () => {
    expect(
      rangeMinutes(customRange("not-a-date", "2026-09-02T09:00:00Z")),
    ).toBeNull();
  });
});

describe("binCount", () => {
  it.each([
    ["minute", 60, 60],
    ["minute", 1440, 1440],
    ["hour", 1440, 24],
    ["hour", 10080, 168],
    ["day", 43200, 30],
    ["10m", 60, 6],
    ["6h", 10080, 28],
  ] as const)("counts %s bins over %s minutes", (bin, minutes, expected) => {
    expect(binCount(bin, spanOf(minutes))).toBe(expected);
  });

  it("returns null for a malformed bin", () => {
    expect(binCount("2mo", spanOf(60))).toBeNull();
  });

  it("returns null for a range where to is not after from", () => {
    expect(
      binCount(
        "minute",
        customRange("2026-09-02T10:00:00Z", "2026-09-02T09:00:00Z"),
      ),
    ).toBeNull();
  });

  it("flags a combination the API would reject", () => {
    // Minute bins over 7 days is 10,080 — well over the ceiling.
    expect(binCount("minute", spanOf(10080))).toBeGreaterThan(MAX_BINS);
  });
});

describe("decomposeBinWidth", () => {
  it("splits a composed width back into a value and unit", () => {
    expect(decomposeBinWidth("45m")).toEqual({ value: 45, unit: "m" });
    expect(decomposeBinWidth("6h")).toEqual({ value: 6, unit: "h" });
  });

  it("round-trips with composeBinWidth", () => {
    expect(decomposeBinWidth(composeBinWidth(3, "d"))).toEqual({
      value: 3,
      unit: "d",
    });
  });

  it("agrees with the default the bin inputs open on", () => {
    expect(
      composeBinWidth(DEFAULT_BIN_DRAFT.value, DEFAULT_BIN_DRAFT.unit),
    ).toBe(DEFAULT_BIN);
  });

  it("returns null for a named bin or a malformed width", () => {
    expect(decomposeBinWidth("minute")).toBeNull();
    expect(decomposeBinWidth("2mo")).toBeNull();
  });
});

describe("autoBinWidth", () => {
  it.each([
    [60, "1m"], // 1 hour
    [60 * 7, "7m"], // 7 hours
    [60 * 24, "24m"], // 1 day
    [60 * 24 * 7, "3h"], // 7 days
    [60 * 24 * 30, "12h"], // 30 days
  ])("resolves a %s minute span to %s", (spanMinutes, expected) => {
    expect(autoBinWidth(spanMinutes)).toBe(expected);
  });

  it("floors at one minute for spans shorter than the target", () => {
    expect(autoBinWidth(15)).toBe("1m");
    expect(autoBinWidth(1)).toBe("1m");
  });

  it("always produces a width the API would accept", () => {
    [15, 60, 360, 1440, 10080, 43200, 60 * 24 * 365].forEach((span) => {
      expect(isValidBinWidth(autoBinWidth(span))).toBe(true);
    });
  });

  it("lands near the target and well under the bin ceiling", () => {
    [60, 420, 1440, 10080, 43200].forEach((span) => {
      const count = binCount(autoBinWidth(span), spanOf(span));

      expect(count).not.toBeNull();
      expect(count).toBeLessThanOrEqual(MAX_BINS);
      // Rounding to a readable unit trades exactness for legibility, so allow
      // a spread around the target rather than demanding it hits 60.
      expect(count).toBeGreaterThanOrEqual(TARGET_BINS / 2);
      expect(count).toBeLessThanOrEqual(TARGET_BINS * 2);
    });
  });
});

describe("rangeFromBins", () => {
  const bins = [
    "2026-09-02T10:00:00Z",
    "2026-09-02T10:10:00Z",
    "2026-09-02T10:20:00Z",
    "2026-09-02T10:30:00Z",
  ];
  const servedTo = "2026-09-02T10:35:00Z";

  it("spans from the first selected bin to the last one's end", () => {
    expect(rangeFromBins(bins, 0, 2, "10m", servedTo)).toEqual({
      from: "2026-09-02T10:00:00Z",
      to: "2026-09-02T10:30:00.000Z",
    });
  });

  it("clamps to the served end, since the final bin is still filling", () => {
    expect(rangeFromBins(bins, 2, 3, "10m", servedTo)).toEqual({
      from: "2026-09-02T10:20:00Z",
      to: "2026-09-02T10:35:00.000Z",
    });
  });

  it("covers a single bin when the drag starts and ends on it", () => {
    expect(rangeFromBins(bins, 1, 1, "10m", servedTo)).toEqual({
      from: "2026-09-02T10:10:00Z",
      to: "2026-09-02T10:20:00.000Z",
    });
  });

  it("returns null for an out-of-bounds index or a malformed bin width", () => {
    expect(rangeFromBins(bins, 0, 9, "10m", servedTo)).toBeNull();
    expect(rangeFromBins(bins, 0, 2, "10x", servedTo)).toBeNull();
    expect(rangeFromBins([], 0, 0, "10m", servedTo)).toBeNull();
  });
});
