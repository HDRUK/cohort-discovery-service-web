"use client";

import L from "leaflet";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import AddressSearch from "./AddressSearch";
import { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
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
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ sm: "center" }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AddressSearch onSelect={handleSearchSelect} />
        </Box>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showBoundaries}
              onChange={(_, checked) => setShowBoundaries(checked)}
            />
          }
          label={<Typography variant="body2">Show LSOA boundaries</Typography>}
          sx={{ flexShrink: 0, mr: 0 }}
        />
      </Stack>

      <GeoMapFrame
        height={mapHeight}
        center={position ?? DEFAULT_MAP_CENTER}
        zoom={position ? PINNED_MAP_ZOOM : DEFAULT_MAP_ZOOM}
      >
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

      <Stack spacing={0.5} px={1}>
        <Typography variant="body2" fontWeight={500}>
          Radius: {formatRadius(radius)}
        </Typography>
        <Slider
          value={metersToSlider(radius)}
          onChange={(_, v) => handleRadiusChange(sliderToMeters(v as number))}
          min={0}
          max={100}
          step={0.5}
          aria-label="Radius"
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            5 km
          </Typography>
          <Typography variant="caption" color="text.secondary">
            1000 km
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary" textAlign="center">
        {position
          ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
          : "Click on the map to drop a pin"}
      </Typography>
    </Stack>
  );
}
