import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QueryResultsTable from "./QueryResultsTable";
import { getMockQuery } from "@/actions/query/__mocks__/getQueries";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { EXAMPLE_1 } from "@/config/queryExamples";
import { Demographics, GeoRadiusLocation } from "@/types/rules";

jest.mock("@/actions/query/getQuery");

// The real map pulls in leaflet (touches `window` at import) — replace it with a
// light stub and make next/dynamic return it synchronously.
jest.mock("@/components/GeoMap/GeoMapReadOnly", () => ({
  __esModule: true,
  default: ({ location }: { location: GeoRadiusLocation }) => (
    <div data-testid="geo-map-read-only">{location.address}</div>
  ),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => jest.requireMock("@/components/GeoMap/GeoMapReadOnly").default,
}));

const LONDON: GeoRadiusLocation = {
  lat: 51.5,
  lon: -0.1,
  radius: 50000,
  address: "London",
};

const withDemographics = (demographics: Demographics) =>
  getMockQuery({ definition: { ...EXAMPLE_1, demographics } });

const renderTable = (
  props: Partial<React.ComponentProps<typeof QueryResultsTable>> = {},
) =>
  render(
    <MockCohortDiscoveryServiceStore>
      <QueryResultsTable initialData={getMockQuery()} {...props} />
    </MockCohortDiscoveryServiceStore>,
  );

describe("QueryResultsTable", () => {
  it("renders the results without a location section when the query has no demographics", () => {
    renderTable();

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(
      screen.queryByTestId("query-results-location"),
    ).not.toBeInTheDocument();
  });

  it("does not render a location section when demographics carry no location", () => {
    renderTable({
      initialData: withDemographics({
        age: null,
        sex: [],
        race: [],
        location: null,
      }),
    });

    expect(
      screen.queryByTestId("query-results-location"),
    ).not.toBeInTheDocument();
  });

  it("renders the location map when the query was run with a location", () => {
    renderTable({
      initialData: withDemographics({
        age: null,
        sex: [],
        race: [],
        location: LONDON,
      }),
    });

    expect(screen.getByTestId("query-results-location")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByTestId("geo-map-read-only")).toHaveTextContent("London");
  });

  it("renders the location map alongside the guidance pane", () => {
    renderTable({
      showGuidance: true,
      initialData: withDemographics({
        age: null,
        sex: [],
        race: [],
        location: LONDON,
      }),
    });

    expect(screen.getByTestId("query-results-location")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
  });
});
