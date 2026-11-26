"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import { QueryQuota } from "@/types/api";

const QueryQuotaSummary = ({ quota }: { quota: QueryQuota }) => {
  if (quota.unlimited) {
    return (
      <Typography variant="body2" color="text.secondary">
        No limit
      </Typography>
    );
  }

  const percentUsed =
    quota.limit > 0 ? Math.min(100, (quota.used / quota.limit) * 100) : 100;
  const limitReached = (quota.remaining ?? 0) <= 0;

  return (
    <Box sx={{ minWidth: 220 }}>
      <LinearProgress
        variant="determinate"
        value={percentUsed}
        color={limitReached ? "error" : "primary"}
        sx={{ height: 8, borderRadius: 4, mb: 0.5 }}
      />
      <Typography
        variant="body2"
        color={limitReached ? "error" : "text.secondary"}
      >
        {quota.used} of {quota.limit} queries used this month
        {limitReached && " — limit reached"}
      </Typography>
    </Box>
  );
};

export default QueryQuotaSummary;
