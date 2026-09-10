import { Concept } from "@/types/api";
import {
  DEFAULT_QUERY,
  EMPTY_DEMOGRAPHICS,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { FeatureFlag, FeatureName } from "@/types/features";
import { DemographicDomain } from "@/config/demographics";

const concept = (
  concept_id: number,
  name: string,
  category: string = DemographicDomain.Gender,
): Concept => ({ concept_id, name, category }) as Concept;

const female = concept(8532, "Female");
const male = concept(8507, "Male");
const white = concept(8527, "White", DemographicDomain.Race);
const black = concept(8516, "Black", DemographicDomain.Race);

const store = () => useQueryBuilderStore.getState();
const demographics = () => store().queryBuilderJson.demographics;
const isValid = () => store().queryBuilderJson.valid;

const setDemographicRuleFlag = (enabled: boolean) =>
  useFeatureFlagsStore.setState({
    flags: {
      [FeatureName.QueryBuilderUseDemographicRule]: enabled,
    } as FeatureFlag,
  });

beforeEach(() => {
  setDemographicRuleFlag(false);
  store().setQueryBuilderJson(DEFAULT_QUERY);
});

describe("queryBuilderStore demographics", () => {
  it("has no demographics block by default", () => {
    expect(demographics()).toBeUndefined();
  });

  it("addDemographics creates an empty block; removeDemographics drops it", () => {
    store().addDemographics();
    expect(demographics()).toEqual({
      id: expect.any(String),
      age: null,
      sex: [],
      race: [],
      location: null,
      death: null,
    });

    store().removeDemographics();
    expect(demographics()).toBeUndefined();
  });

  it("setDemographics writes the whole block in one go", () => {
    const location = { lat: 51.5, lon: -0.1, radius: 50000, address: "London" };
    store().setDemographics({
      age: [18, 65],
      sex: [female, male],
      race: [white],
      location,
      death: { value: 0, label: "Not recorded" },
    });

    expect(demographics()).toEqual({
      id: expect.any(String),
      age: [18, 65],
      sex: [female, male],
      race: [white],
      location,
      death: { value: 0, label: "Not recorded" },
    });
  });

  it("setDemographics replaces the previous block rather than merging", () => {
    store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: [18, 65] });
    store().setDemographics({ ...EMPTY_DEMOGRAPHICS, race: [white, black] });

    expect(demographics()).toEqual({
      id: expect.any(String),
      age: null,
      sex: [],
      race: [white, black],
      location: null,
      death: null,
    });
  });

  it("keeps demographics inside queryBuilderJson (single source of truth)", () => {
    store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [male] });
    expect(store().queryBuilderJson.demographics?.sex).toEqual([male]);
  });

  describe("block id (what the panel is keyed on)", () => {
    const id = () => demographics()?.id;

    beforeEach(() => {
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: [18, 65] });
    });

    it("is assigned when the block is created", () => {
      expect(id()).toEqual(expect.any(String));
    });

    it("survives an edit written by the panel", () => {
      const before = demographics() ?? EMPTY_DEMOGRAPHICS;

      store().setDemographics({ ...before, age: [20, 65] });

      expect(id()).toBe(before.id);
    });

    it("changes when a new query replaces the block", () => {
      const before = id();

      store().setQueryBuilderJson({
        ...store().queryBuilderJson,
        demographics: { ...EMPTY_DEMOGRAPHICS, sex: [female] },
      });

      expect(id()).toEqual(expect.any(String));
      expect(id()).not.toBe(before);
    });

    it("keeps an id that comes in with a saved definition", () => {
      store().setQueryBuilderJson({
        ...store().queryBuilderJson,
        demographics: { ...EMPTY_DEMOGRAPHICS, id: "saved-id", sex: [female] },
      });

      expect(id()).toBe("saved-id");
    });

    it("survives a query update that leaves the block alone", () => {
      const before = id();

      store().setQueryBuilderJson({
        ...store().queryBuilderJson,
        rules: [...store().queryBuilderJson.rules],
      });

      expect(id()).toBe(before);
    });
  });

  describe("run-query validity (demographic-rule flag on)", () => {
    beforeEach(() => {
      setDemographicRuleFlag(true);
      store().setQueryBuilderJson(DEFAULT_QUERY);
    });

    it("is valid with a demographic age set and no rules", () => {
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: [50, 80] });
      expect(isValid()).toBe(true);
    });

    it("is valid with a demographic sex set and no rules", () => {
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [female] });
      expect(isValid()).toBe(true);
    });

    it("stays invalid when the demographics block is empty", () => {
      store().addDemographics();
      expect(isValid()).toBe(false);
    });

    it("becomes invalid again once demographics are cleared", () => {
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: [50, 80] });
      expect(isValid()).toBe(true);

      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: null });
      expect(isValid()).toBe(false);
    });

    it("becomes invalid when the whole block is removed", () => {
      store().setDemographics({ ...EMPTY_DEMOGRAPHICS, sex: [female] });
      expect(isValid()).toBe(true);

      store().removeDemographics();
      expect(isValid()).toBe(false);
    });
  });

  it("stays invalid with demographics set when the flag is off", () => {
    setDemographicRuleFlag(false);
    store().setQueryBuilderJson(DEFAULT_QUERY);
    store().setDemographics({ ...EMPTY_DEMOGRAPHICS, age: [50, 80] });
    expect(isValid()).toBe(false);
  });
});
