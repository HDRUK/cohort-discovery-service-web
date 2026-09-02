import { MAX_RADIUS, MIN_RADIUS } from "@/config/map";
import { metersToSlider, sliderToMeters } from "../radiusScale";

describe("radius scale", () => {
  it("defaults to a 25 km minimum radius", () => {
    expect(MIN_RADIUS).toBe(25_000);
    expect(sliderToMeters(0, MIN_RADIUS)).toBe(25_000);
  });

  it("spans the minimum to the maximum across the track", () => {
    expect(sliderToMeters(100, MIN_RADIUS)).toBe(MAX_RADIUS);
  });

  it("round-trips a radius back to its slider position", () => {
    const metres = sliderToMeters(42, MIN_RADIUS);

    expect(metersToSlider(metres, MIN_RADIUS)).toBeCloseTo(42, 1);
  });

  it("clamps a radius saved below the minimum onto the start of the track", () => {
    expect(metersToSlider(5_000, MIN_RADIUS)).toBe(0);
  });

  it("honours an overridden minimum", () => {
    expect(sliderToMeters(0, 10_000)).toBe(10_000);
    expect(metersToSlider(10_000, 10_000)).toBe(0);
  });
});
