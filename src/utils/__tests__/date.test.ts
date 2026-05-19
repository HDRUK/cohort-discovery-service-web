import { getDurationSeconds } from "@/utils/date";

describe("getDurationSeconds", () => {
  it("returns formatted duration for valid start and end", () => {
    expect(
      getDurationSeconds("2024-01-01T00:00:00.000Z", "2024-01-01T00:00:05.000Z"),
    ).toBe("5.0s");
  });

  it("returns fractional seconds", () => {
    expect(
      getDurationSeconds("2024-01-01T00:00:00.000Z", "2024-01-01T00:00:01.500Z"),
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
    expect(getDurationSeconds("not-a-date", "2024-01-01T00:00:05.000Z")).toBeNull();
  });
});
