import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";
import {
  DEFAULT_QUERY,
  EMPTY_DEMOGRAPHICS,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { FeatureFlag, FeatureName } from "@/types/features";
import { MAX_AGE_FILTER } from "@/config/rules";
import { useUserDataStore } from "@/hooks/userDataStore";
import { Collection } from "@/types/api";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import DemographicsPanel from "./DemographicsPanel";

// The real picker pulls in leaflet (touches `window` at import) — replace it
// with a light stub and make next/dynamic return it synchronously.
jest.mock("@/components/GeoMap/GeoMapPicker", () => ({
  __esModule: true,
  default: () => <div data-testid="geo-map-picker" />,
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => jest.requireMock("@/components/GeoMap/GeoMapPicker").default,
}));

const store = () => useQueryBuilderStore.getState();
const demographics = () => store().queryBuilderJson.demographics;

const female = { concept_id: 8532, name: "Female", category: "Gender" };

const renderPanel = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ApplicationModeProvider>
        <DemographicsPanel />
      </ApplicationModeProvider>
    </QueryClientProvider>,
  );

const setAgeMin = async (value: string) => {
  const [minInput] = screen.getAllByRole("spinbutton");
  await userEvent.clear(minInput);
  await userEvent.type(minInput, value);
  await userEvent.keyboard("{Enter}");
};

describe("DemographicsPanel", () => {
  describe("first open (freshly added, nothing saved yet)", () => {
    beforeEach(() => {
      store().setQueryBuilderJson(DEFAULT_QUERY);
      store().addDemographics();
    });

    it("opens every row for editing with a single Save button at the bottom", () => {
      renderPanel();

      expect(
        screen.getAllByRole("button", { name: /save selection and collapse/i }),
      ).toHaveLength(1);
      expect(
        screen.queryByRole("button", { name: /reset selection/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /edit age/i }),
      ).not.toBeInTheDocument();
    });

    it("doesn't write to the store until Save is clicked", async () => {
      renderPanel();

      await setAgeMin("20");

      expect(demographics()?.age).toBeNull();
    });

    it("commits every field at once and collapses the panel on Save", async () => {
      renderPanel();

      await setAgeMin("20");
      await userEvent.click(
        screen.getByRole("button", { name: /save selection and collapse/i }),
      );

      expect(demographics()?.age).toEqual([20, MAX_AGE_FILTER]);
      expect(
        screen.getByRole("button", { name: /expand demographics/i }),
      ).toBeInTheDocument();
    });
  });

  describe("after the first save (one row editable at a time)", () => {
    beforeEach(() => {
      store().setQueryBuilderJson(DEFAULT_QUERY);
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [female] });
    });

    it("disables the other rows' Edit buttons while a row is being edited", async () => {
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit age/i }));

      expect(screen.getByRole("button", { name: /edit sex/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /edit race/i })).toBeDisabled();
      expect(
        screen.getByRole("button", { name: /reset selection/i }),
      ).toBeInTheDocument();
    });

    it("Reset Selection clears the field, saves it, and keeps the row open", async () => {
      store().setDemographics({
        ...EMPTY_DEMOGRAPHICS,
        sex: [female],
        age: [20, MAX_AGE_FILTER],
      });
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit age/i }));
      await setAgeMin("40");
      await userEvent.click(
        screen.getByRole("button", { name: /reset selection/i }),
      );

      expect(demographics()?.age).toBeNull();
      expect(demographics()?.sex).toEqual([female]);
      expect(
        screen.getByRole("button", { name: /reset selection/i }),
      ).toBeInTheDocument();
    });

    it("Reset Selection clears a saved Sex selection", async () => {
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit sex/i }));
      await userEvent.click(
        screen.getByRole("button", { name: /reset selection/i }),
      );

      expect(demographics()?.sex).toEqual([]);
    });

    it("Save Selection and Collapse commits only the field that was edited", async () => {
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit age/i }));
      await setAgeMin("30");
      await userEvent.click(
        screen.getByRole("button", { name: /save selection and collapse/i }),
      );

      expect(demographics()?.age).toEqual([30, MAX_AGE_FILTER]);
      expect(demographics()?.sex).toEqual([female]);
      expect(
        screen.getByRole("button", { name: /expand demographics/i }),
      ).toBeInTheDocument();
    });

    it("Clear all on a different row commits immediately and survives a later Save elsewhere", async () => {
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit age/i }));
      await setAgeMin("30");

      await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
      expect(demographics()?.sex).toEqual([]);

      await userEvent.click(
        screen.getByRole("button", { name: /save selection and collapse/i }),
      );
      expect(demographics()?.age).toEqual([30, MAX_AGE_FILTER]);
      expect(demographics()?.sex).toEqual([]);
    });
  });

  describe("query-builder-use-race feature flag", () => {
    beforeEach(() => {
      store().setQueryBuilderJson(DEFAULT_QUERY);
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [female] });
    });

    afterEach(() => {
      useFeatureFlagsStore.setState({ flags: null });
    });

    it("shows the Race row by default", () => {
      renderPanel();

      expect(
        screen.getByRole("button", { name: /edit race/i }),
      ).toBeInTheDocument();
    });

    it("hides the Race row when the flag is disabled", () => {
      useFeatureFlagsStore.setState({
        flags: { [FeatureName.QueryBuilderUseRace]: false } as FeatureFlag,
      });
      renderPanel();

      expect(
        screen.queryByRole("button", { name: /edit race/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("location availability", () => {
    const withLocation = getMockCollection({
      pid: "pid-with-location",
      location_enabled: true,
    });
    const withoutLocation = getMockCollection({
      pid: "pid-without-location",
      location_enabled: false,
    });

    const setUp = (
      userCollections: Collection[],
      selectedDatasets: string[],
    ) => {
      useUserDataStore.setState({ userCollections });
      store().setQueryBuilderJson(DEFAULT_QUERY);
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [female] });
      store().setSelectedDatasets(selectedDatasets);
    };

    beforeEach(() => {
      useFeatureFlagsStore.setState({
        flags: { [FeatureName.QueryBuilderUseLocation]: true } as FeatureFlag,
      });
    });

    afterEach(() => {
      useFeatureFlagsStore.setState({ flags: null });
      useUserDataStore.setState({ userCollections: [] });
    });

    const openLocationRow = () =>
      userEvent.click(screen.getByRole("button", { name: /edit location/i }));

    it("shows the map picker when a selected collection has location enabled", async () => {
      setUp(
        [withLocation, withoutLocation],
        [withLocation.pid, withoutLocation.pid],
      );
      renderPanel();

      await openLocationRow();

      expect(screen.getByTestId("geo-map-picker")).toBeInTheDocument();
      expect(
        screen.queryByText(/location filtering is not available/i),
      ).not.toBeInTheDocument();
    });

    it("explains that location is unavailable when no collection has it enabled", async () => {
      setUp([withoutLocation], [withoutLocation.pid]);
      renderPanel();

      await openLocationRow();

      expect(
        screen.getByText(/location filtering is not available/i),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("geo-map-picker")).not.toBeInTheDocument();
    });

    it("ignores location-enabled collections that aren't selected", async () => {
      setUp([withLocation, withoutLocation], [withoutLocation.pid]);
      renderPanel();

      await openLocationRow();

      expect(
        screen.getByText(/location filtering is not available/i),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("geo-map-picker")).not.toBeInTheDocument();
    });
  });
});
