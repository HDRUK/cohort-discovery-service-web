type Ring = number[][];

const pointInRing = (lat: number, lon: number, ring: Ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const pointInPolygon = (
  lat: number,
  lon: number,
  coordinates: number[][][] | number[][][][],
  type: "Polygon" | "MultiPolygon",
): boolean => {
  if (type === "Polygon") {
    const rings = coordinates as Ring[];
    if (!pointInRing(lat, lon, rings[0])) return false;
    for (let i = 1; i < rings.length; i++) {
      if (pointInRing(lat, lon, rings[i])) return false;
    }
    return true;
  }

  const polys = coordinates as Ring[][];
  return polys.some((rings) => {
    if (!pointInRing(lat, lon, rings[0])) return false;
    for (let i = 1; i < rings.length; i++) {
      if (pointInRing(lat, lon, rings[i])) return false;
    }
    return true;
  });
};
