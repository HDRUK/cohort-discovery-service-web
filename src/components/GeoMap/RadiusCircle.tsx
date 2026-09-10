"use client";

import L from "leaflet";
import { Circle } from "react-leaflet";
import { useTheme } from "@mui/material";

interface RadiusCircleProps {
  center: L.LatLngTuple;
  radius: number;
  interactive?: boolean;
}

const RadiusCircle = ({ center, radius, interactive }: RadiusCircleProps) => {
  const color = useTheme().palette.link.main;

  return (
    <Circle
      center={center}
      radius={radius}
      interactive={interactive}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.15 }}
    />
  );
};

export default RadiusCircle;
