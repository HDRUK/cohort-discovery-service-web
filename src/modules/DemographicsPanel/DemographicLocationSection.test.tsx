import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DEFAULT_QUERY,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import DemographicLocationSection from "./DemographicLocationSection";

// The real picker pulls in leaflet (touches `window` at import) — replace it
// with a light stub and make next/dynamic return it synchronously.
jest.mock("@/components/GeoMap/GeoMapPicker", () => ({
  __esModule: true,
  default: ({ value }: { value: unknown }) => (
    <div data-testid="geo-map-picker">{value ? "picker:set" : "picker:empty"}</div>
  ),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => jest.requireMock("@/components/GeoMap/GeoMapPicker").default,
}));

const store = () => useQueryBuilderStore.getState();
const location = () => store().queryBuilderJson.demographics?.location;

const setLondon = () =>
  store().setDemographicsLocation({
    lat: 51.5,
    lon: -0.1,
    radius: 50000,
    address: "London",
  });

beforeEach(() => {
  store().setQueryBuilderJson(DEFAULT_QUERY);
  store().addDemographics();
});

describe("DemographicLocationSection", () => {
  it("renders the Location row with an Any chip by default", () => {
    render(<DemographicLocationSection />);
    expect(screen.getByText(/Location/)).toBeInTheDocument();
    expect(screen.getByText("Any")).toBeInTheDocument();
  });

  it("summarises a set location", () => {
    setLondon();
    render(<DemographicLocationSection />);
    expect(
      screen.getByText("Within 50.0 km of London"),
    ).toBeInTheDocument();
  });

  it("reveals the map picker and guidance when editing", async () => {
    render(<DemographicLocationSection />);
    await userEvent.click(
      screen.getByRole("button", { name: /edit location/i }),
    );
    expect(screen.getByTestId("geo-map-picker")).toBeInTheDocument();
    expect(screen.getByText(/drop a pin/i)).toBeInTheDocument();
  });

  it("clears the location via Clear all", async () => {
    setLondon();
    render(<DemographicLocationSection />);
    await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(location()).toBeNull();
  });
});
