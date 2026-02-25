import { ListSubheader, Divider, Box } from "@mui/material";

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
    <ListSubheader
      disableSticky
      disableGutters
      sx={{
        position: "static",
        bgcolor: "transparent",
        fontSize: 15,
        fontWeight: 400,
        color: "text.secondary",
        lineHeight: 1.2,
        px: 0,
        mb: 1,
      }}
    >
      {children}
    </ListSubheader>

    <Divider />
  </Box>
);
