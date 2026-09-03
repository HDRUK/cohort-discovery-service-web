"use client";

import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { extractPostcode, formatRadius } from "@/components/GeoMap";
import {
  demographicUnavailableGuidance,
  locationGuidance,
} from "@/config/demographics";
import { Demographics } from "@/types/rules";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";

// Leaflet touches `window` at module load, so the map must never render on the
// server — load it only in the browser once the row is being edited.
const GeoMapPicker = dynamic(() => import("@/components/GeoMap/GeoMapPicker"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={500} />,
});

interface DemographicLocationSectionProps extends DemographicRowActionProps {
  locationAvailable: boolean;
}

const DemographicLocationSection = ({
  locationAvailable,
  ...props
}: DemographicLocationSectionProps) => {
  const { control } = useFormContext<Demographics>();
  const { location } = useQueryBuilder((qb) => ({
    location: qb.queryBuilderJson.demographics?.location ?? null,
  }));

  const summaryLabel = location
    ? `Within ${formatRadius(location.radius)} of ${
        (location.address && extractPostcode(location.address)) ??
        location.address ??
        `(${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})`
      }`
    : "Any";

  return (
    <DemographicRow
      label="Location"
      {...props}
      showClear={location !== null}
      renderEditing={
        !locationAvailable ? (
          <Typography variant="body2" color="text.secondary">
            {demographicUnavailableGuidance("location")}
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: 450,
              overflowY: "auto",
              overflowX: "hidden",
              pr: 1,
            }}
          >
            <Stack spacing={1}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <GeoMapPicker
                    value={field.value}
                    onChange={field.onChange}
                    mapHeight={400}
                  />
                )}
              />
              <Typography variant="body2" color="text.secondary">
                {locationGuidance}
              </Typography>
            </Stack>
          </Box>
        )
      }
    >
      <Chip variant="outlined" sx={{ bgcolor: "white" }} label={summaryLabel} />
    </DemographicRow>
  );
};

export default DemographicLocationSection;
