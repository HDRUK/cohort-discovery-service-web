"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ReactNode, useEffect, useState } from "react";
import {
  AttributionControl,
  MapContainer,
  MapContainerProps,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Box } from "@mui/material";
import {
  LEAFLET_ATTRIBUTION_PREFIX,
  MAX_MAP_ZOOM,
  TILE_ATTRIBUTION,
  TILE_URL,
} from "@/config/map";

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
}: GeoMapFrameProps) => {
  // react-leaflet can't survive React <Activity> (used by Cache Components):
  // hiding destroys the Leaflet map but keeps the reference. A new key gives
  // us a fresh map when shown again. See "Limitations" in
  // https://react-leaflet.js.org/docs/start-introduction/
  const [mapKey, setMapKey] = useState(0);
  useEffect(() => () => setMapKey((k) => k + 1), []);

  return (
    <Box
      sx={{
        height,
        width: "100%",
        "& .leaflet-container": { borderRadius: 1 },
      }}
    >
      <MapContainer
        key={mapKey}
        bounds={fitBounds}
        boundsOptions={{ padding: BOUNDS_PADDING }}
        maxZoom={MAX_MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
        {...mapProps}
      >
        <AttributionControl prefix={LEAFLET_ATTRIBUTION_PREFIX} />
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <SettleOnMount fitBounds={fitBounds} />
        {children}
      </MapContainer>
    </Box>
  );
};

export default GeoMapFrame;
