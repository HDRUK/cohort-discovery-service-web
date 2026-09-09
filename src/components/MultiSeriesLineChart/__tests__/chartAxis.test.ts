import { tickStep } from "../chartAxis";

describe("tickStep", () => {
  it("labels every bin when they already fit the target", () => {
    expect(tickStep(6)).toBe(1);
    expect(tickStep(1)).toBe(1);
  });

  it("thins the labels just enough to reach the target", () => {
    expect(tickStep(12)).toBe(2);
    expect(tickStep(13)).toBe(3);
    expect(tickStep(2000)).toBe(334);
  });

  it("never returns zero, so no caller divides by it", () => {
    expect(tickStep(0)).toBe(1);
    expect(tickStep(-5)).toBe(1);
  });

  it("honours a different target", () => {
    expect(tickStep(100, 10)).toBe(10);
  });
});
