"use client";

import { Box, Grid, Typography } from "@mui/material";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Box>
    <Typography
      variant="subtitle2"
      sx={{ mb: 1.5, color: "secondaryBlack.main" }}
    >
      {title}
    </Typography>
    <Grid container spacing={2.5}>
      {children}
    </Grid>
  </Box>
);

export default Section;
