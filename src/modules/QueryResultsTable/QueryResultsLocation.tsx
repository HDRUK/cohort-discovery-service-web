"use client";

import dynamic from "next/dynamic";
import { Skeleton, Stack } from "@mui/material";
import { GeoRadiusLocation } from "@/types/rules";
import Title from "@/components/Title";

const MAP_HEIGHT = 400;

// Leaflet touches `window` at module load, so the map must never render on the server.
const GeoMapReadOnly = dynamic(
  () => import("@/components/GeoMap/GeoMapReadOnly"),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={MAP_HEIGHT} />,
  },
);

interface QueryResultsLocationProps {
  location: GeoRadiusLocation;
}

const QueryResultsLocation = ({ location }: QueryResultsLocationProps) => (
  <Stack spacing={1} data-testid="query-results-location">
    <GeoMapReadOnly location={location} mapHeight={MAP_HEIGHT} />
  </Stack>
);

export default QueryResultsLocation;
