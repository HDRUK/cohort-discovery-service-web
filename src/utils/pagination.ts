import { Paginated } from "@/types/api";

const NICE_STEPS = [1, 2, 5, 10, 25, 50, 100, 200, 500, 1000];
const MULTIPLIERS = [0.25, 0.5, 1, 2, 4];

const roundToNice = (n: number) => {
  if (!Number.isFinite(n) || n <= 0) return 0;

  const magnitude = Math.pow(10, Math.floor(Math.log10(n)));

  let best = NICE_STEPS[0] * magnitude;
  let bestDiff = Math.abs(best - n);

  for (const step of NICE_STEPS) {
    const c1 = step * magnitude;
    const d1 = Math.abs(c1 - n);
    if (d1 < bestDiff) {
      best = c1;
      bestDiff = d1;
    }

    const c2 = step * magnitude * 10;
    const d2 = Math.abs(c2 - n);
    if (d2 < bestDiff) {
      best = c2;
      bestDiff = d2;
    }
  }

  return Math.max(1, Math.round(best));
};

const buildRowsPerPageOptions = (
  perPageDefault: number,
  min = 5,
  max = 200,
) => {
  const effectiveMin =
    perPageDefault >= 50 ? 10 : perPageDefault >= 25 ? 5 : min;

  const snapped = MULTIPLIERS.map((m) => perPageDefault * m).map(roundToNice);

  const options = [effectiveMin, ...snapped, perPageDefault]
    .map((v) => Math.max(effectiveMin, v))
    .filter((v) => v <= max);

  return Array.from(new Set(options)).sort((a, b) => a - b);
};

export { buildRowsPerPageOptions };

export const emptyPaginated = <T>(data: T[]): Paginated<T> => ({
  data,
  current_page: 1,
  per_page: 0,
  total: 0,
  from: 0,
  to: 0,
  last_page: 1,
  path: undefined,
  first_page_url: undefined,
  last_page_url: undefined,
  next_page_url: null,
  prev_page_url: null,
});
