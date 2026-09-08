"use client";

import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import { Chip, Skeleton, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { extractPostcode, formatRadius } from "@/components/GeoMap";
import {
  demographicUnavailableGuidance,
  locationGuidance,
} from "@/config/demographics";
import { Demographics } from "@/types/rules";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";

const MAP_HEIGHT = 300;

// Leaflet touches `window` at module load, so the map must never render on the
// server — load it only in the browser once the row is being edited.
const GeoMapPicker = dynamic(() => import("@/components/GeoMap/GeoMapPicker"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={MAP_HEIGHT} />,
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
          <Stack spacing={1} sx={{ pr: 1 }}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <GeoMapPicker
                  value={field.value}
                  onChange={field.onChange}
                  mapHeight={MAP_HEIGHT}
                />
              )}
            />
            <Typography variant="body2" color="text.secondary">
              {locationGuidance}
            </Typography>
          </Stack>
        )
      }
    >
      <Chip variant="outlined" sx={{ bgcolor: "white" }} label={summaryLabel} />
    </DemographicRow>
  );
};

export default DemographicLocationSection;
