import { formatAge, formatDuration, getDurationSeconds } from "@/utils/date";

describe("getDurationSeconds", () => {
  it("returns formatted duration for valid start and end", () => {
    expect(
      getDurationSeconds(
        "2024-01-01T00:00:00.000Z",
        "2024-01-01T00:00:05.000Z",
      ),
    ).toBe("5.0s");
  });

  it("returns fractional seconds", () => {
    expect(
      getDurationSeconds(
        "2024-01-01T00:00:00.000Z",
        "2024-01-01T00:00:01.500Z",
      ),
    ).toBe("1.5s");
  });

  it("returns null when start is null", () => {
    expect(getDurationSeconds(null, "2024-01-01T00:00:05.000Z")).toBeNull();
  });

  it("returns null when end is null", () => {
    expect(getDurationSeconds("2024-01-01T00:00:00.000Z", null)).toBeNull();
  });

  it("returns null when both are undefined", () => {
    expect(getDurationSeconds()).toBeNull();
  });

  it("returns null for an invalid date string", () => {
    expect(
      getDurationSeconds("not-a-date", "2024-01-01T00:00:05.000Z"),
    ).toBeNull();
  });
});

describe("formatDuration", () => {
  it("keeps sub-second values in milliseconds", () => {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(40)).toBe("40ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  it("switches to seconds at one second, with more precision below ten", () => {
    expect(formatDuration(1000)).toBe("1.00s");
    expect(formatDuration(9994)).toBe("9.99s");
    expect(formatDuration(12500)).toBe("12.5s");
  });

  it("switches to minutes and seconds at one minute", () => {
    expect(formatDuration(60_000)).toBe("1m 00s");
    expect(formatDuration(95_000)).toBe("1m 35s");
    expect(formatDuration(3_723_000)).toBe("62m 03s");
  });

  it("renders a placeholder for anything that is not a number", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(undefined)).toBe("—");
    expect(formatDuration(Number.NaN)).toBe("—");
  });
});

const NOW = Date.parse("2026-09-07T12:00:00.000Z");
const isoAgo = (ms: number) => new Date(NOW - ms).toISOString();

describe("formatAge", () => {
  it.each([
    [5_000, "5s"],
    [90_000, "1m"],
    [2 * 60 * 60 * 1000, "2h"],
    [3 * 24 * 60 * 60 * 1000, "3d"],
  ])("formats %ims as %s", (ms, expected) => {
    expect(formatAge(isoAgo(ms), NOW)).toBe(expected);
  });

  it("returns 'never' for a missing or invalid date", () => {
    expect(formatAge(null, NOW)).toBe("never");
    expect(formatAge("not-a-date", NOW)).toBe("never");
  });
});
