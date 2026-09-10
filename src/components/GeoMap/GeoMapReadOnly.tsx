"use client";

import L from "leaflet";
import { Marker } from "react-leaflet";
import { useMemo } from "react";
import { GeoRadiusLocation } from "@/types/rules";
import GeoMapFrame from "./GeoMapFrame";
import LSOABoundaries from "./LSOABoundaries";
import RadiusCircle from "./RadiusCircle";
import usePinIcon from "./usePinIcon";

interface GeoMapReadOnlyProps {
  location: GeoRadiusLocation;
  mapHeight?: number;
}

export default function GeoMapReadOnly({
  location,
  mapHeight = 400,
}: GeoMapReadOnlyProps) {
  const pinIcon = usePinIcon();

  const { lat, lon, radius } = location;
  const position: L.LatLngTuple = [lat, lon];
  // Radii run from 5 km to 1000 km, so frame the circle rather than fix a zoom.
  const bounds = useMemo(
    () => L.latLng(lat, lon).toBounds(radius * 2),
    [lat, lon, radius],
  );

  return (
    <GeoMapFrame
      height={mapHeight}
      fitBounds={bounds}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      boxZoom={false}
    >
      <LSOABoundaries pinPosition={position} radius={radius} enabled />
      <Marker position={position} icon={pinIcon} interactive={false} />
      <RadiusCircle center={position} radius={radius} interactive={false} />
    </GeoMapFrame>
  );
}
