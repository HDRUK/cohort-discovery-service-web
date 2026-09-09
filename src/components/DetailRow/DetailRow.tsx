import { Box, Typography } from "@mui/material";

interface DetailRowProps {
  label: string;
  value: string | null;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ minWidth: 110, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
      {value ?? "—"}
    </Typography>
  </Box>
);

export default DetailRow;
