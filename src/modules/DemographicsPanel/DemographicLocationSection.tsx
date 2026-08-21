"use client";

import dynamic from "next/dynamic";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { formatRadius } from "@/components/GeoMap";
import { locationGuidance } from "@/config/demographics";
import DemographicRow from "./DemographicRow";

// Leaflet touches `window` at module load, so the map must never render on the
// server — load it only in the browser once the row is being edited.
const GeoMapPicker = dynamic(() => import("@/components/GeoMap/GeoMapPicker"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={500} />,
});

const DemographicLocationSection = () => {
  const { location, setLocation } = useQueryBuilder((qb) => ({
    location: qb.queryBuilderJson.demographics?.location ?? null,
    setLocation: qb.setDemographicsLocation,
  }));

  const summaryLabel = location
    ? `Within ${formatRadius(location.radius)} of ${
        location.address ??
        `(${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})`
      }`
    : "Any";

  return (
    <DemographicRow
      label="Location"
      onClear={() => setLocation(null)}
      showClear={location !== null}
      renderEditing={
        <Box
          sx={{ maxHeight: 450, overflowY: "auto", overflowX: "hidden", pr: 1 }}
        >
          <Stack spacing={1} marginX={10}>
            <GeoMapPicker
              value={location}
              onChange={setLocation}
              mapHeight={400}
            />
            <Typography variant="body2" color="text.secondary">
              {locationGuidance}
            </Typography>
          </Stack>
        </Box>
      }
    >
      <Chip variant="outlined" sx={{ bgcolor: "white" }} label={summaryLabel} />
    </DemographicRow>
  );
};

export default DemographicLocationSection;
