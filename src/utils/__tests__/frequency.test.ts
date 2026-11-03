import { FrequencyMode } from "@/types/api";
import { clampRunTimeFrequency } from "@/utils/frequency";

const WEEKLY = Number(FrequencyMode.WEEKLY);
const MONTHLY = Number(FrequencyMode.MONTHLY);
const BIANNUALLY = Number(FrequencyMode.BIANNUALLY);
const UNKNOWN_MODE = 99;

describe("clampRunTimeFrequency", () => {
  it("keeps a run time that exists for the mode", () => {
    expect(clampRunTimeFrequency(WEEKLY, 6)).toBe(6);
    expect(clampRunTimeFrequency(MONTHLY, 1)).toBe(1);
  });

  it("resets a run time beyond the mode's options to the first option", () => {
    expect(clampRunTimeFrequency(BIANNUALLY, 6)).toBe(0);
    expect(clampRunTimeFrequency(MONTHLY, 5)).toBe(0);
  });

  it("resets a negative or fractional run time", () => {
    expect(clampRunTimeFrequency(WEEKLY, -1)).toBe(0);
    expect(clampRunTimeFrequency(WEEKLY, 1.5)).toBe(0);
  });

  it("resets a missing run time", () => {
    expect(clampRunTimeFrequency(WEEKLY, undefined)).toBe(0);
  });

  it("resets the run time when the mode is unknown", () => {
    expect(clampRunTimeFrequency(UNKNOWN_MODE, 1)).toBe(0);
  });
});
