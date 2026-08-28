import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import {
  DEFAULT_QUERY,
  EMPTY_DEMOGRAPHICS,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { Demographics } from "@/types/rules";
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

const setLondon = () =>
  store().setDemographics({
    ...(store().queryBuilderJson.demographics ?? EMPTY_DEMOGRAPHICS),
    location: { lat: 51.5, lon: -0.1, radius: 50000, address: "London" },
  });

const Harness = ({
  editing = false,
  onSave = jest.fn(),
  onReset = jest.fn(),
  onClear = jest.fn(),
}: {
  editing?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  onClear?: () => void;
}) => {
  const form = useForm<Demographics>({
    defaultValues: store().queryBuilderJson.demographics ?? EMPTY_DEMOGRAPHICS,
  });

  return (
    <FormProvider {...form}>
      <DemographicLocationSection
        editing={editing}
        disabled={false}
        hideActions={false}
        onEditStart={() => {}}
        onSave={onSave}
        onReset={onReset}
        onClear={onClear}
      />
    </FormProvider>
  );
};

beforeEach(() => {
  store().setQueryBuilderJson(DEFAULT_QUERY);
  store().addDemographics();
});

describe("DemographicLocationSection", () => {
  it("renders the Location row with an Any chip by default", () => {
    render(<Harness />);
    expect(screen.getByText(/Location/)).toBeInTheDocument();
    expect(screen.getByText("Any")).toBeInTheDocument();
  });

  it("summarises a set location, falling back to the full address when no postcode can be extracted", () => {
    setLondon();
    render(<Harness />);
    expect(
      screen.getByText("Within 50.0 km of London"),
    ).toBeInTheDocument();
  });

  it("truncates the address to its postcode when the address contains one", () => {
    store().setDemographics({
      ...(store().queryBuilderJson.demographics ?? EMPTY_DEMOGRAPHICS),
      location: {
        lat: 51.5,
        lon: -0.1,
        radius: 50000,
        address:
          "10 Downing Street, Westminster, London, Greater London, England, SW1A 2AA, United Kingdom",
      },
    });
    render(<Harness />);
    expect(
      screen.getByText("Within 50.0 km of SW1A 2AA"),
    ).toBeInTheDocument();
  });

  it("reveals the map picker and guidance when editing", async () => {
    render(<Harness editing />);
    expect(screen.getByTestId("geo-map-picker")).toBeInTheDocument();
    expect(screen.getByText(/drop a pin/i)).toBeInTheDocument();
  });

  it("keeps the header plain while editing", () => {
    render(<Harness editing />);
    expect(screen.queryByText(/LatLng/)).not.toBeInTheDocument();
  });

  it("clears the location via Clear all", async () => {
    setLondon();
    const onClear = jest.fn();
    render(<Harness onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onClear).toHaveBeenCalled();
  });
});
