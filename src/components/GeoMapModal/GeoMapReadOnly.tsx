"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { GeoRadiusLocation } from "@/types/rules";
import LSOABoundaries from "./LSOABoundaries";

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

interface GeoMapReadOnlyProps {
  location: GeoRadiusLocation;
}

export default function GeoMapReadOnly({ location }: GeoMapReadOnlyProps) {
  const position: L.LatLngTuple = [location.lat, location.lon];

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        "& .leaflet-container": { borderRadius: 1 },
      }}
    >
      <MapContainer
        center={position}
        zoom={10}
        maxZoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        boxZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateOnMount />
        <LSOABoundaries
          pinPosition={position}
          radius={location.radius}
          enabled={true}
        />
        <Marker position={position} icon={pinIcon} />
        <Circle
          center={position}
          radius={location.radius}
          pathOptions={{
            color: "#1976d2",
            fillColor: "#1976d2",
            fillOpacity: 0.15,
          }}
        />
      </MapContainer>
    </Box>
  );
}
