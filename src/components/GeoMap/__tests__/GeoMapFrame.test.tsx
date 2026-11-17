import { Activity } from "react";
import { act, render } from "@testing-library/react";
import { useMap } from "react-leaflet";
import GeoMapFrame from "../GeoMapFrame";

// Reads map state during render, like LSOABoundaries does. A destroyed
// Leaflet map throws here.
const ReadsMapState = () => {
  useMap().getBounds();
  return null;
};

const renderInActivity = (mode: "visible" | "hidden") => (
  <Activity mode={mode}>
    <GeoMapFrame height={400} center={[54, -2]} zoom={6}>
      <ReadsMapState />
    </GeoMapFrame>
  </Activity>
);

describe("GeoMapFrame", () => {
  // Cache Components keeps visited routes in a hidden <Activity>. Going
  // History -> Results -> History -> Results must not reuse a destroyed map.
  it("gives children a working map after being hidden and shown again", async () => {
    const { rerender } = render(renderInActivity("visible"));
    await act(async () => rerender(renderInActivity("hidden")));
    await expect(
      act(async () => rerender(renderInActivity("visible"))),
    ).resolves.not.toThrow();
  });
});
