import { Concept } from "@/types/api";
import {
  DEFAULT_QUERY,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { FeatureFlag, FeatureName } from "@/types/features";

const concept = (concept_id: number, name: string): Concept =>
  ({ concept_id, name, category: "Gender" }) as Concept;

const female = concept(8532, "Female");
const male = concept(8507, "Male");

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
    expect(demographics()).toEqual({ age: null, sex: [], race: [] });

    store().removeDemographics();
    expect(demographics()).toBeUndefined();
  });

  it("setDemographicsAge writes the age range into the block", () => {
    store().addDemographics();
    store().setDemographicsAge([18, 65]);
    expect(demographics()?.age).toEqual([18, 65]);
  });

  it("toggleDemographicsSex adds and removes without duplicating", () => {
    store().toggleDemographicsSex(female, true);
    store().toggleDemographicsSex(female, true);
    expect(demographics()?.sex).toEqual([female]);

    store().toggleDemographicsSex(male, true);
    expect(demographics()?.sex).toHaveLength(2);

    store().toggleDemographicsSex(female, false);
    expect(demographics()?.sex).toEqual([male]);
  });

  it("clearDemographicsSex empties sex without touching age", () => {
    store().setDemographicsAge([0, 30]);
    store().toggleDemographicsSex(female, true);
    store().clearDemographicsSex();
    expect(demographics()?.sex).toEqual([]);
    expect(demographics()?.age).toEqual([0, 30]);
  });

  it("keeps demographics inside queryBuilderJson (single source of truth)", () => {
    store().toggleDemographicsSex(male, true);
    expect(store().queryBuilderJson.demographics?.sex).toEqual([male]);
  });

  describe("run-query validity (demographic-rule flag on)", () => {
    beforeEach(() => {
      setDemographicRuleFlag(true);
      store().setQueryBuilderJson(DEFAULT_QUERY);
    });

    it("is valid with a demographic age set and no rules", () => {
      store().setDemographicsAge([50, 80]);
      expect(isValid()).toBe(true);
    });

    it("is valid with a demographic sex set and no rules", () => {
      store().toggleDemographicsSex(female, true);
      expect(isValid()).toBe(true);
    });

    it("stays invalid when the demographics block is empty", () => {
      store().addDemographics();
      expect(isValid()).toBe(false);
    });

    it("becomes invalid again once demographics are cleared", () => {
      store().setDemographicsAge([50, 80]);
      expect(isValid()).toBe(true);

      store().setDemographicsAge(null);
      expect(isValid()).toBe(false);
    });

    it("becomes invalid when the whole block is removed", () => {
      store().toggleDemographicsSex(female, true);
      expect(isValid()).toBe(true);

      store().removeDemographics();
      expect(isValid()).toBe(false);
    });
  });

  it("stays invalid with demographics set when the flag is off", () => {
    setDemographicRuleFlag(false);
    store().setQueryBuilderJson(DEFAULT_QUERY);
    store().setDemographicsAge([50, 80]);
    expect(isValid()).toBe(false);
  });
});
