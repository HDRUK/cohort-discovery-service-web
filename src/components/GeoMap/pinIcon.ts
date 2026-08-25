import L from "leaflet";

const PIN_SIZE = 16;

export const makePinIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div class="geomap-pin" style="--pin-color:${color}"></div>`,
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
  });
