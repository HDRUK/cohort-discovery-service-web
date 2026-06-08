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
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import Modal from "@/components/Modal";
import { GeoRadiusLocation } from "@/types/rules";

const pinIcon = new L.DivIcon({
  className: "",
  html: '<div style="width:16px;height:16px;background:#1976d2;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const formatRadius = (m: number) => `${(m / 1000).toFixed(1)} km`;

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

  // Reset draft state each time the modal opens
  const [lastOpen, setLastOpen] = useState(false);
  if (!lastOpen && open) {
    setLastOpen(true);
    setPosition(initialLocation ? [initialLocation.lat, initialLocation.lon] : null);
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
      maxWidth="md"
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
        <Box
          sx={{
            height: 400,
            width: "100%",
            "& .leaflet-container": { borderRadius: 1 },
          }}
        >
          <MapContainer
            center={position ?? defaultCenter}
            zoom={position ? 10 : 6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <InvalidateOnMount />
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
            value={radius}
            onChange={(_, v) => setRadius(v as number)}
            min={10000}
            max={1000000}
            step={1000}
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
