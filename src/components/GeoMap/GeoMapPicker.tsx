"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
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
import LSOABoundaries from "./LSOABoundaries";

const MIN_RADIUS = 5_000;
const MAX_RADIUS = 1_000_000;
const DEFAULT_RADIUS = 50_000;
const sliderToMeters = (v: number) =>
  Math.round(MIN_RADIUS * Math.pow(MAX_RADIUS / MIN_RADIUS, v / 100));
const metersToSlider = (m: number) =>
  (Math.log(m / MIN_RADIUS) / Math.log(MAX_RADIUS / MIN_RADIUS)) * 100;

const pinIcon = new L.DivIcon({
  className: "",
  html: '<div style="width:16px;height:16px;background:#1976d2;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FlyTo({ target }: { target: L.LatLngTuple | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 12);
  }, [target, map]);
  return null;
}

function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: L.LatLngTuple | null;
  onPositionChange: (pos: L.LatLngTuple) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  if (!position) return null;
  return <Marker position={position} icon={pinIcon} />;
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
  const defaultCenter: L.LatLngTuple = [54.0, -2.0];

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

      <Box
        sx={{
          height: mapHeight,
          width: "100%",
          "& .leaflet-container": { borderRadius: 1 },
        }}
      >
        <MapContainer
          center={position ?? defaultCenter}
          zoom={position ? 10 : 6}
          maxZoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <InvalidateOnMount />
          <FlyTo target={flyTarget} />
          <LSOABoundaries
            pinPosition={position}
            radius={radius}
            enabled={showBoundaries}
          />
          <LocationMarker position={position} onPositionChange={handlePinDrop} />
          {position && (
            <Circle
              center={position}
              radius={radius}
              pathOptions={{
                color: "#1976d2",
                fillColor: "#1976d2",
                fillOpacity: 0.15,
              }}
            />
          )}
        </MapContainer>
      </Box>

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
