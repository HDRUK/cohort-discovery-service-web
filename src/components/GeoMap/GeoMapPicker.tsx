"use client";

import L from "leaflet";
import { Marker, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import AddressSearch from "./AddressSearch";
import { useEffect, useState } from "react";
import { Box, Slider, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ToggleAction from "@/components/ToggleAction";
import { GeoRadiusLocation } from "@/types/rules";
import { formatRadius } from "./formatRadius";
import GeoMapFrame from "./GeoMapFrame";
import LSOABoundaries from "./LSOABoundaries";
import RadiusCircle from "./RadiusCircle";
import usePinIcon from "./usePinIcon";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_RADIUS,
  FLY_TO_ZOOM,
  MAX_RADIUS,
  MIN_RADIUS,
  PINNED_MAP_ZOOM,
} from "@/config/map";

const sliderToMeters = (v: number) =>
  Math.round(MIN_RADIUS * Math.pow(MAX_RADIUS / MIN_RADIUS, v / 100));
const metersToSlider = (m: number) =>
  (Math.log(m / MIN_RADIUS) / Math.log(MAX_RADIUS / MIN_RADIUS)) * 100;

function FlyTo({ target }: { target: L.LatLngTuple | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, FLY_TO_ZOOM);
  }, [target, map]);
  return null;
}

function LocationMarker({
  position,
  onPositionChange,
  icon,
}: {
  position: L.LatLngTuple | null;
  onPositionChange: (pos: L.LatLngTuple) => void;
  icon: L.DivIcon;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  if (!position) return null;
  return <Marker position={position} icon={icon} />;
}

interface GeoMapPickerProps {
  value: GeoRadiusLocation | null;
  onChange: (location: GeoRadiusLocation | null) => void;
  mapHeight?: number;
}

export default function GeoMapPicker({
  value,
  onChange,
  mapHeight = 500,
}: GeoMapPickerProps) {
  const pinIcon = usePinIcon();

  const [position, setPosition] = useState<L.LatLngTuple | null>(
    value ? [value.lat, value.lon] : null,
  );
  const [radius, setRadius] = useState(value?.radius ?? DEFAULT_RADIUS);
  const [address, setAddress] = useState<string | undefined>(value?.address);
  const [flyTarget, setFlyTarget] = useState<L.LatLngTuple | null>(null);
  const [showBoundaries, setShowBoundaries] = useState(true);
  // Frame the saved radius on first render — a fixed zoom would otherwise
  // ignore how wide an existing location's radius actually is.
  const [initialBounds] = useState(() =>
    value ? L.latLng(value.lat, value.lon).toBounds(value.radius * 2) : undefined,
  );

  const handlePinDrop = (pos: L.LatLngTuple) => {
    setPosition(pos);
    setAddress(undefined);
    onChange({ lat: pos[0], lon: pos[1], radius, address: undefined });
  };

  const handleSearchSelect = (pos: L.LatLngTuple, addr: string) => {
    setPosition(pos);
    setFlyTarget(pos);
    setAddress(addr);
    onChange({ lat: pos[0], lon: pos[1], radius, address: addr });
  };

  const handleRadiusChange = (r: number) => {
    setRadius(r);
    if (position) {
      onChange({ lat: position[0], lon: position[1], radius: r, address });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <GeoMapFrame
        height={mapHeight}
        center={position ?? DEFAULT_MAP_CENTER}
        zoom={position ? PINNED_MAP_ZOOM : DEFAULT_MAP_ZOOM}
        fitBounds={initialBounds}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <FlyTo target={flyTarget} />
        <LSOABoundaries
          pinPosition={position}
          radius={radius}
          enabled={showBoundaries}
        />
        <LocationMarker
          position={position}
          onPositionChange={handlePinDrop}
          icon={pinIcon}
        />
        {position && <RadiusCircle center={position} radius={radius} />}
      </GeoMapFrame>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 1,
          px: 1.5,
          py: 0.75,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AddressSearch onSelect={handleSearchSelect} />
        </Box>
        <ToggleAction
          size={25}
          active={showBoundaries}
          onToggle={() => setShowBoundaries((prev) => !prev)}
          activeIcon={CheckIcon}
          inactiveIcon={CloseIcon}
        />
        <Typography variant="body2" sx={{ flexShrink: 0 }}>
          LSOA boundaries
        </Typography>
      </Stack>

      {position && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            zIndex: 1000,
            bgcolor: "background.paper",
            borderRadius: 5,
            boxShadow: 1,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography variant="body2" fontWeight={500} sx={{ flexShrink: 0 }}>
            Radius
          </Typography>
          <Slider
            value={metersToSlider(radius)}
            onChange={(_, v) => handleRadiusChange(sliderToMeters(v as number))}
            min={0}
            max={100}
            step={0.5}
            aria-label="Radius"
            size="small"
            sx={{ width: 120 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flexShrink: 0 }}
          >
            +{formatRadius(radius)}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
