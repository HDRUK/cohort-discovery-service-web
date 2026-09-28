import { Box, Paper, Skeleton, Typography } from "@mui/material";

const SKELETON_ROW_HEIGHTS = [72, 56, 72, 56];
const DOT_ANIMATION_DELAYS = [0, 0.2, 0.4];

const ThinkingDots = () => (
  <Box component="span" sx={{ display: "inline-flex", ml: 0.5 }}>
    {DOT_ANIMATION_DELAYS.map((delay, index) => (
      <Box
        key={index}
        component="span"
        sx={{
          "@keyframes queryBuilderThinkingDot": {
            "0%, 80%, 100%": { opacity: 0.2 },
            "40%": { opacity: 1 },
          },
          animation: "queryBuilderThinkingDot 1.4s ease-in-out infinite",
          animationDelay: `${delay}s`,
        }}
      >
        .
      </Box>
    ))}
  </Box>
);

export const QueryBuilderThinkingSkeleton = () => (
  <Paper
    sx={{
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      flexGrow: 1,
      maxWidth: "700px",
      width: "100%",
      p: 3,
    }}
  >
    <Typography textAlign="center" fontSize="large" sx={{ mb: 3 }}>
      Thinking
      <ThinkingDots />
    </Typography>

    <Box display="flex" flexDirection="column" gap={2}>
      {SKELETON_ROW_HEIGHTS.map((height, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={height}
          sx={{ borderRadius: 1 }}
        />
      ))}
    </Box>
  </Paper>
);
