import { Box, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";

interface SectionCardProps {
  title?: string;
  action?: ReactNode;
  accentColour?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const SectionCard = ({
  title,
  action,
  accentColour,
  children,
  sx,
}: SectionCardProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5,
      minWidth: 0,
      bgcolor: "background.paper",
      borderColor: "divider",
      ...(accentColour && {
        borderLeftWidth: 3,
        borderLeftColor: accentColour,
      }),
      ...sx,
    }}
  >
    {(title || action) && (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1, gap: 1 }}
      >
        {title && (
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        )}
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
    )}
    {children}
  </Paper>
);

export default SectionCard;
