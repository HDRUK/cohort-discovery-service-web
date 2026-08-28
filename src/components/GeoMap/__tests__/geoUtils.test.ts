import { haversineMetres } from "../haversine";
import { pointInPolygon } from "../pointInPolygon";
import { formatRadius } from "../formatRadius";
import { extractPostcode } from "../extractPostcode";

describe("formatRadius", () => {
  it("formats metres as kilometres to one decimal place", () => {
    expect(formatRadius(50000)).toBe("50.0 km");
    expect(formatRadius(5000)).toBe("5.0 km");
    expect(formatRadius(1234)).toBe("1.2 km");
  });
});

describe("extractPostcode", () => {
  it("extracts the postcode from a realistic Nominatim display_name", () => {
    expect(
      extractPostcode(
        "10 Downing Street, Westminster, London, Greater London, England, SW1A 2AA, United Kingdom",
      ),
    ).toBe("SW1A 2AA");
  });

  it("returns null when no postcode-shaped substring exists", () => {
    expect(
      extractPostcode("Buckingham Palace, London, England, United Kingdom"),
    ).toBeNull();
  });

  it("matches a postcode at the start of the string", () => {
    expect(extractPostcode("SW1A 2AA, Westminster, London")).toBe(
      "SW1A 2AA",
    );
  });

  it("matches a postcode at the end with no trailing comma", () => {
    expect(extractPostcode("Greater London, England, SW1A 2AA")).toBe(
      "SW1A 2AA",
    );
  });

  it("is case-insensitive on input and upper-cases the output", () => {
    expect(
      extractPostcode("10 downing street, london, sw1a 2aa, united kingdom"),
    ).toBe("SW1A 2AA");
  });

  it("normalises irregular spacing", () => {
    expect(extractPostcode("England, SW1A2AA, United Kingdom")).toBe(
      "SW1A 2AA",
    );
  });

  it("prefers the last match when an earlier postcode-shaped substring exists", () => {
    expect(
      extractPostcode("AA1 1AA Business Park, Leeds, LS1 4DY, United Kingdom"),
    ).toBe("LS1 4DY");
  });
});

describe("haversineMetres", () => {
  it("is zero for identical points", () => {
    expect(haversineMetres(51.5, -0.1, 51.5, -0.1)).toBe(0);
  });

  it("approximates a known distance (London → Paris ≈ 340km)", () => {
    const d = haversineMetres(51.5074, -0.1278, 48.8566, 2.3522);
    expect(d).toBeGreaterThan(330_000);
    expect(d).toBeLessThan(350_000);
  });
});

describe("pointInPolygon", () => {
  // Unit square with corners (0,0)-(10,10); coords are [lon, lat] pairs.
  const square = [
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ];

  it("detects a point inside a polygon", () => {
    expect(pointInPolygon(5, 5, square, "Polygon")).toBe(true);
  });

  it("rejects a point outside a polygon", () => {
    expect(pointInPolygon(20, 20, square, "Polygon")).toBe(false);
  });

  it("excludes points inside a hole", () => {
    const withHole = [
      square[0],
      [
        [4, 4],
        [6, 4],
        [6, 6],
        [4, 6],
        [4, 4],
      ],
    ];
    expect(pointInPolygon(5, 5, withHole, "Polygon")).toBe(false);
    expect(pointInPolygon(1, 1, withHole, "Polygon")).toBe(true);
  });

  it("handles MultiPolygon by matching any part", () => {
    const multi = [
      square,
      [
        [
          [20, 20],
          [30, 20],
          [30, 30],
          [20, 30],
          [20, 20],
        ],
      ],
    ];
    expect(pointInPolygon(25, 25, multi, "MultiPolygon")).toBe(true);
    expect(pointInPolygon(15, 15, multi, "MultiPolygon")).toBe(false);
  });
});
