"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from "geojson";
import { pointInPolygon } from "./pointInPolygon";
import { haversineMetres } from "./haversine";

const MIN_ZOOM_FOR_BOUNDARIES = 8;
const MAX_RENDERED_FEATURES = 1500;

type EnrichedProps = {
  __id: string;
  __centroid: [number, number];
  __bbox: [number, number, number, number];
  [key: string]: unknown;
};

type BoundaryFeature = Feature<Polygon | MultiPolygon, EnrichedProps>;
type BoundaryCollection = FeatureCollection<Polygon | MultiPolygon, EnrichedProps>;

let cachedData: BoundaryCollection | null = null;
let inFlight: Promise<BoundaryCollection> | null = null;

const enrich = (
  f: Feature<Polygon | MultiPolygon>,
  i: number,
): BoundaryFeature => {
  const coords: number[][] =
    f.geometry.type === "Polygon"
      ? f.geometry.coordinates[0]
      : f.geometry.coordinates.flat(2);

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const c of coords) {
    const lon = c[0];
    const lat = c[1];
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
  }

  const props = (f.properties ?? {}) as Record<string, unknown>;
  const id = String(
    props.LSOA21CD ??
      props.dzcode ??
      props.LSOA21NM ??
      props.dzname ??
      i,
  );

  return {
    ...f,
    properties: {
      ...props,
      __id: id,
      __centroid: [(minLat + maxLat) / 2, (minLon + maxLon) / 2],
      __bbox: [minLat, minLon, maxLat, maxLon],
    },
  };
};

const fetchOptional = async (
  url: string,
): Promise<FeatureCollection<Polygon | MultiPolygon>> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return { type: "FeatureCollection", features: [] };
    return (await res.json()) as FeatureCollection<Polygon | MultiPolygon>;
  } catch {
    return { type: "FeatureCollection", features: [] };
  }
};

const loadGeoJSON = async (): Promise<BoundaryCollection> => {
  if (cachedData) return cachedData;
  if (!inFlight) {
    inFlight = Promise.all([
      fetchOptional("/data/LSOA.geojson"),
      fetchOptional("/data/DataZones.geojson"),
    ]).then(([lsoa, dz]) => {
      const features = [...lsoa.features, ...dz.features].map((f, i) =>
        enrich(f, i),
      );
      cachedData = { type: "FeatureCollection", features };
      return cachedData;
    });
  }
  return inFlight;
};

interface Props {
  pinPosition: L.LatLngTuple | null;
  radius: number;
  enabled: boolean;
}

const LSOABoundaries = ({ pinPosition, radius, enabled }: Props) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState<L.LatLngBounds>(map.getBounds());
  const [data, setData] = useState<BoundaryCollection | null>(cachedData);

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
      setBounds(map.getBounds());
    },
    moveend: () => setBounds(map.getBounds()),
  });

  useEffect(() => {
    if (!enabled || zoom < MIN_ZOOM_FOR_BOUNDARIES || data) return;
    let cancelled = false;
    loadGeoJSON().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, zoom, data]);

  const visibleFeatures = useMemo<BoundaryFeature[]>(() => {
    if (!data || zoom < MIN_ZOOM_FOR_BOUNDARIES) return [];
    const inView: BoundaryFeature[] = [];
    for (const f of data.features) {
      const [minLat, minLon, maxLat, maxLon] = f.properties.__bbox;
      const fb = L.latLngBounds([minLat, minLon], [maxLat, maxLon]);
      if (bounds.intersects(fb)) {
        inView.push(f);
        if (inView.length >= MAX_RENDERED_FEATURES) break;
      }
    }
    return inView;
  }, [data, bounds, zoom]);

  const pinContains = useMemo<BoundaryFeature | null>(() => {
    if (!pinPosition || !data) return null;
    const [lat, lon] = pinPosition;
    return (
      data.features.find((f) =>
        pointInPolygon(
          lat,
          lon,
          f.geometry.coordinates as number[][][] | number[][][][],
          f.geometry.type,
        ),
      ) ?? null
    );
  }, [pinPosition, data]);

  const withinRadius = useMemo<BoundaryFeature[]>(() => {
    if (!pinPosition || !radius) return [];
    const [pinLat, pinLon] = pinPosition;
    return visibleFeatures.filter((f) => {
      const [lat, lon] = f.properties.__centroid;
      return haversineMetres(pinLat, pinLon, lat, lon) <= radius;
    });
  }, [visibleFeatures, pinPosition, radius]);

  if (!enabled || zoom < MIN_ZOOM_FOR_BOUNDARIES || !data) return null;

  const withinRadiusIds = new Set(withinRadius.map((f) => f.properties.__id));
  const pinContainsId = pinContains?.properties.__id;
  const baseFeatures = visibleFeatures.filter(
    (f) =>
      !withinRadiusIds.has(f.properties.__id) &&
      f.properties.__id !== pinContainsId,
  );
  const withinRadiusOnly = withinRadius.filter(
    (f) => f.properties.__id !== pinContainsId,
  );

  return (
    <>
      <GeoJSON
        key={`base-${baseFeatures.length}-${bounds.toBBoxString()}`}
        data={
          {
            type: "FeatureCollection",
            features: baseFeatures,
          } as FeatureCollection<Polygon | MultiPolygon>
        }
        style={{
          color: "#555",
          weight: 0.5,
          opacity: 0.5,
          fillOpacity: 0,
        }}
        interactive={false}
      />
      <GeoJSON
        key={`within-${withinRadiusOnly.length}-${radius}-${pinContainsId ?? "x"}`}
        data={
          {
            type: "FeatureCollection",
            features: withinRadiusOnly,
          } as FeatureCollection<Polygon | MultiPolygon>
        }
        style={{
          color: "#1976d2",
          weight: 1,
          opacity: 0.7,
          fillColor: "#1976d2",
          fillOpacity: 0.12,
        }}
        interactive={false}
      />
      {pinContains && (
        <GeoJSON
          key={`pin-${pinContainsId ?? "x"}`}
          data={pinContains}
          style={{
            color: "#1976d2",
            weight: 2.5,
            opacity: 1,
            fillColor: "#1976d2",
            fillOpacity: 0.25,
          }}
          interactive={false}
        />
      )}
    </>
  );
};

export default LSOABoundaries;
