import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";
import {
  DEFAULT_QUERY,
  EMPTY_DEMOGRAPHICS,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { MAX_AGE_FILTER } from "@/config/rules";
import DemographicsPanel from "./DemographicsPanel";

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

    it("commits every field at once and collapses on Save", async () => {
      renderPanel();

      await setAgeMin("20");
      await userEvent.click(
        screen.getByRole("button", { name: /save selection and collapse/i }),
      );

      expect(demographics()?.age).toEqual([20, MAX_AGE_FILTER]);
      expect(
        screen.queryByRole("button", { name: /save selection and collapse/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /edit age/i }),
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

    it("Reset Selection discards the draft without writing to the store", async () => {
      renderPanel();

      await userEvent.click(screen.getByRole("button", { name: /edit age/i }));
      await setAgeMin("40");
      await userEvent.click(
        screen.getByRole("button", { name: /reset selection/i }),
      );

      expect(demographics()?.age).toBeNull();
      expect(
        screen.getByRole("button", { name: /edit sex/i }),
      ).not.toBeDisabled();
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
});
