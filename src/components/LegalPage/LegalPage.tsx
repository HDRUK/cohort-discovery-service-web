import { Alert, Box, Container, Link, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface LegalPageProps {
  title: string;
  sourceLabel: string;
  sourceHref: string;
  lastUpdated: string;
  children: ReactNode;
}

const LegalPage = ({
  title,
  sourceLabel,
  sourceHref,
  lastUpdated,
  children,
}: LegalPageProps) => (
  <Container maxWidth="md" sx={{ py: 5 }}>
    <Typography variant="h3" component="h1" sx={{ color: "text.primary" }}>
      {title}
    </Typography>

    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
      Last updated {lastUpdated}
    </Typography>

    <Alert severity="info" sx={{ mb: 4 }}>
      This is the{" "}
      <Link href={sourceHref} target="_blank" rel="noopener noreferrer">
        {sourceLabel}
      </Link>
      , which covers Cohort Discovery. If your organisation runs its own Cohort
      Discovery deployment, ask your administrator which policy applies to you.
    </Alert>

    <Box
      sx={{
        "& h2": {
          typography: "h4",
          color: "text.primary",
          mt: 4,
          mb: 1.5,
        },
        "& h3": { typography: "h5", color: "text.primary", mt: 3, mb: 1 },
        "& p": { typography: "body1", color: "text.primary", mb: 2 },
        "& li": { typography: "body1", color: "text.primary", mb: 1 },
        "& ul, & ol": { pl: 3, mb: 2 },
        "& a": { color: "link.main" },
      }}
    >
      {children}
    </Box>
  </Container>
);

export default LegalPage;
