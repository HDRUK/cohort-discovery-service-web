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
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Modal from "@/components/Modal";
import { GeoRadiusLocation } from "@/types/rules";
import { formatRadius } from "./formatRadius";
import LSOABoundaries from "./LSOABoundaries";

const MIN_RADIUS = 10_000;
const MAX_RADIUS = 1_000_000;
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

interface GeoMapModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (location: GeoRadiusLocation) => void;
  initialLocation?: GeoRadiusLocation;
}

export default function GeoMapModal({
  open,
  onClose,
  onConfirm,
  initialLocation,
}: GeoMapModalProps) {
  const defaultCenter: L.LatLngTuple = [54.0, -2.0];

  const [position, setPosition] = useState<L.LatLngTuple | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lon] : null,
  );
  const [radius, setRadius] = useState(initialLocation?.radius ?? 50000);
  const [showBoundaries, setShowBoundaries] = useState(true);

  // Reset draft state each time the modal opens
  const [lastOpen, setLastOpen] = useState(false);
  if (!lastOpen && open) {
    setLastOpen(true);
    setPosition(
      initialLocation ? [initialLocation.lat, initialLocation.lon] : null,
    );
    setRadius(initialLocation?.radius ?? 50000);
  } else if (lastOpen && !open) {
    setLastOpen(false);
  }

  const handleConfirm = () => {
    if (!position) return;
    onConfirm({ lat: position[0], lon: position[1], radius });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pick location"
      maxWidth="lg"
      actionLabel="Cancel"
      additionalActions={
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!position}
        >
          Confirm
        </Button>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showBoundaries}
                onChange={(_, checked) => setShowBoundaries(checked)}
              />
            }
            label={
              <Typography variant="body2">Show LSOA boundaries</Typography>
            }
          />
        </Stack>
        <Box
          sx={{
            height: 600,
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
            <LSOABoundaries
              pinPosition={position}
              radius={radius}
              enabled={showBoundaries}
            />
            <LocationMarker
              position={position}
              onPositionChange={setPosition}
            />
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
            onChange={(_, v) => setRadius(sliderToMeters(v as number))}
            min={0}
            max={100}
            step={0.5}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              10 km
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
    </Modal>
  );
}
