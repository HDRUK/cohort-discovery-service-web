import { MAX_RADIUS } from "@/config/map";

export const sliderToMeters = (v: number, min: number) =>
  Math.round(min * Math.pow(MAX_RADIUS / min, v / 100));

export const metersToSlider = (m: number, min: number) =>
  (Math.log(Math.max(m, min) / min) / Math.log(MAX_RADIUS / min)) * 100;
