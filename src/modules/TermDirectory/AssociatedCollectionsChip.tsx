import { Box, Chip, Typography } from "@mui/material";
import HelpTooltip from "@/components/HelpTooltip";

interface AssociatedCollectionsChipProps {
  count: number;
  names: string[];
}

const AssociatedCollectionsChip = ({
  count,
  names,
}: AssociatedCollectionsChipProps) => (
  <HelpTooltip
    placement="left"
    title={
      names?.length > 0 && (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {names.map((name) => (
            <Typography key={name} component="li" fontWeight={700}>
              {name}
            </Typography>
          ))}
        </Box>
      )
    }
  >
    <Chip
      // focusable, so keyboard users can open the tooltip too
      tabIndex={0}
      size="small"
      label={`${count} Collection${count === 1 ? "" : "s"}`}
      sx={{
        bgcolor: "tooltip.main",
        color: "white",
        borderRadius: "3px",
        fontSize: "14.2px",
      }}
    />
  </HelpTooltip>
);

export default AssociatedCollectionsChip;
