"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import { GeoRadiusLocation } from "@/types/rules";
import LSOABoundaries from "./LSOABoundaries";
import { makePinIcon } from "./pinIcon";
import { MAX_MAP_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/config/map";

const BOUNDS_PADDING: L.PointTuple = [16, 16];

// The map can mount inside a container that has not been laid out yet, which
// leaves the initial fit at the wrong zoom, so re-measure and re-fit once it has.
function FitBoundsOnMount({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: BOUNDS_PADDING });
    }, 150);
    return () => clearTimeout(t);
  }, [map, bounds]);
  return null;
}

interface GeoMapReadOnlyProps {
  location: GeoRadiusLocation;
  mapHeight?: number;
}

export default function GeoMapReadOnly({
  location,
  mapHeight = 400,
}: GeoMapReadOnlyProps) {
  const theme = useTheme();
  const accentColor = theme.palette.link.main;
  const pinIcon = useMemo(() => makePinIcon(accentColor), [accentColor]);

  const { lat, lon, radius } = location;
  const position: L.LatLngTuple = [lat, lon];
  const bounds = useMemo(
    () => L.latLng(lat, lon).toBounds(radius * 2),
    [lat, lon, radius],
  );

  return (
    <Box
      sx={{
        height: mapHeight,
        width: "100%",
        "& .leaflet-container": { borderRadius: 1 },
      }}
    >
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: BOUNDS_PADDING }}
        maxZoom={MAX_MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        boxZoom={false}
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <FitBoundsOnMount bounds={bounds} />
        <LSOABoundaries pinPosition={position} radius={radius} enabled />
        <Marker position={position} icon={pinIcon} interactive={false} />
        <Circle
          center={position}
          radius={radius}
          interactive={false}
          pathOptions={{
            color: accentColor,
            fillColor: accentColor,
            fillOpacity: 0.15,
          }}
        />
      </MapContainer>
    </Box>
  );
}
