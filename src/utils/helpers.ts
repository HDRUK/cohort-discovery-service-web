import type { SxProps, Theme } from "@mui/material/styles";

const mergeSx = (
  base: SxProps<Theme>,
  ...overrides: Array<SxProps<Theme> | undefined>
): SxProps<Theme> => {
  return [base, ...overrides] as SxProps<Theme>;
};

const tryParseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export { mergeSx, tryParseJson };
