"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ReactNode, useEffect } from "react";
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Box } from "@mui/material";
import { MAX_MAP_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/config/map";

const BOUNDS_PADDING: L.PointTuple = [16, 16];

// The map can mount before its container has been laid out, which leaves the
// tiles mis-measured and any initial fit at the wrong zoom.
function SettleOnMount({ fitBounds }: { fitBounds?: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
      if (fitBounds) map.fitBounds(fitBounds, { padding: BOUNDS_PADDING });
    }, 150);
    return () => clearTimeout(t);
  }, [map, fitBounds]);
  return null;
}

interface GeoMapFrameProps extends MapContainerProps {
  height: number;
  /** Frames the map on these bounds instead of a centre and zoom. */
  fitBounds?: L.LatLngBounds;
  children: ReactNode;
}

const GeoMapFrame = ({
  height,
  fitBounds,
  children,
  ...mapProps
}: GeoMapFrameProps) => (
  <Box
    sx={{
      height,
      width: "100%",
      "& .leaflet-container": { borderRadius: 1 },
    }}
  >
    <MapContainer
      bounds={fitBounds}
      boundsOptions={{ padding: BOUNDS_PADDING }}
      maxZoom={MAX_MAP_ZOOM}
      style={{ height: "100%", width: "100%" }}
      {...mapProps}
    >
      <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
      <SettleOnMount fitBounds={fitBounds} />
      {children}
    </MapContainer>
  </Box>
);

export default GeoMapFrame;
