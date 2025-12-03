import type { SxProps, Theme } from "@mui/material/styles";

const mergeSx = (
  base: SxProps<Theme>,
  override?: SxProps<Theme>
): SxProps<Theme> => {
  if (!override) return base;
  return [base, override] as SxProps<Theme>;
};

export { mergeSx };
