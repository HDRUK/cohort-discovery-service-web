"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import dynamic from "next/dynamic";
import { GeoRadiusLocation, DemographicFilterType } from "@/types/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { isDemographicFilter, isGeoRadiusLocation, updateById } from "@/utils/rules";
import { formatRadius } from "@/components/GeoMapModal";

const GeoMapModal = dynamic(
  () => import("@/components/GeoMapModal/GeoMapModal"),
  { ssr: false },
);

interface LocationSelectorProps {
  rule: DemographicFilterType;
}

const LocationSelector = ({ rule }: LocationSelectorProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const geoLocation =
    rule.location && isGeoRadiusLocation(rule.location)
      ? rule.location
      : undefined;

  const handleConfirm = (geo: GeoRadiusLocation) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isDemographicFilter(node)) return node;
        return { ...node, location: geo };
      }),
    );
  };

  const handleClear = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isDemographicFilter(node)) return node;
        return { ...node, location: undefined };
      }),
    );
  };

  return (
    <Stack spacing={1} sx={{ my: 1 }}>
      {geoLocation ? (
        <Stack spacing={0.5}>
          <Typography variant="body2">
            Within {formatRadius(geoLocation.radius)} of{" "}
            {geoLocation.address ?? `(${geoLocation.lat.toFixed(4)}, ${geoLocation.lon.toFixed(4)})`}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => setModalOpen(true)}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setModalOpen(true)}
        >
          Pick on map
        </Button>
      )}

      <GeoMapModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialLocation={geoLocation}
      />
    </Stack>
  );
};

export default LocationSelector;
