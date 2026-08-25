"use client";

import L from "leaflet";
import { useMemo } from "react";
import { useTheme } from "@mui/material";

const PIN_SIZE = 16;

const makePinIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div class="geomap-pin" style="--pin-color:${color}"></div>`,
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
  });

const usePinIcon = () => {
  const theme = useTheme();
  const color = theme.palette.link.main;
  return useMemo(() => makePinIcon(color), [color]);
};

export default usePinIcon;
