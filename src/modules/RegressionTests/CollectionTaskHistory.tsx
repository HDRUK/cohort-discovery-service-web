import { Box, Chip, Stack, Typography } from "@mui/material";
import { RegressionTestCollection } from "@/types/api";
import { getDatetime, getDurationSeconds } from "@/utils/date";
import PassFailChip from "./PassFailChip";

interface CollectionTaskHistoryProps {
  col: RegressionTestCollection;
}

const CollectionTaskHistory = ({ col }: CollectionTaskHistoryProps) => {
  if (col.tasks.length === 0) return null;

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Stack spacing={0.5}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 0.5, pb: 0.5, borderBottom: 1, borderColor: "divider" }}
        >
          {[
            { label: "Run Date", flex: 2 },
            { label: "Count", width: 90 },
            { label: "Time", width: 70 },
            { label: "Status", width: 80 },
          ].map(({ label, flex, width }) => (
            <Typography
              key={label}
              variant="caption"
              color="text.secondary"
              sx={{ flex, width, fontWeight: 600 }}
            >
              {label}
            </Typography>
          ))}
        </Stack>

        {col.tasks.map((task) => {
          const duration = getDurationSeconds(
            task.created_at,
            task.completed_at ?? task.failed_at,
          );
          const count = task.result?.count;
          const passed =
            col.expected_result != null && count != null
              ? count === col.expected_result
              : null;

          return (
            <Stack
              key={task.pid}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ px: 0.5, py: 0.25 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flex: 2 }}
              >
                {getDatetime(task.created_at)}
              </Typography>
              <Box sx={{ width: 90 }}>
                {count != null ? (
                  <Chip
                    label={count.toLocaleString()}
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  "—"
                )}
              </Box>
              <Typography variant="body2" sx={{ width: 70 }}>
                {duration ?? "—"}
              </Typography>
              <Box sx={{ width: 80 }}>
                <PassFailChip value={passed} />
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CollectionTaskHistory;
