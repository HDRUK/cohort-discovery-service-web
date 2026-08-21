import type { LatLngTuple } from "leaflet";

// Centre of Great Britain, used before a pin is dropped.
export const DEFAULT_MAP_CENTER: LatLngTuple = [54.0, -2.0];

export const DEFAULT_MAP_ZOOM = 6;
export const PINNED_MAP_ZOOM = 10;
export const FLY_TO_ZOOM = 12;
export const MAX_MAP_ZOOM = 13;

export const MIN_RADIUS = 5_000;
export const MAX_RADIUS = 1_000_000;
export const DEFAULT_RADIUS = 50_000;

export const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MIN_ZOOM_FOR_BOUNDARIES = 8;
export const MAX_RENDERED_FEATURES = 1500;
