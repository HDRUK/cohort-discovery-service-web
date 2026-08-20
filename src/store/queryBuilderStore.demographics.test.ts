import { Concept } from "@/types/api";
import {
  DEFAULT_QUERY,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { FeatureFlag, FeatureName } from "@/types/features";
import {
  DemographicConceptField,
  DemographicDomain,
} from "@/config/demographics";

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
    expect(demographics()).toEqual({ age: null, sex: [], race: [] });

    store().removeDemographics();
    expect(demographics()).toBeUndefined();
  });

  it("setDemographicsAge writes the age range into the block", () => {
    store().addDemographics();
    store().setDemographicsAge([18, 65]);
    expect(demographics()?.age).toEqual([18, 65]);
  });

  it("toggleDemographicsConcept adds and removes sex without duplicating", () => {
    store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
    store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
    expect(demographics()?.sex).toEqual([female]);

    store().toggleDemographicsConcept(DemographicConceptField.Sex, male, true);
    expect(demographics()?.sex).toHaveLength(2);

    store().toggleDemographicsConcept(DemographicConceptField.Sex, female, false);
    expect(demographics()?.sex).toEqual([male]);
  });

  it("toggleDemographicsConcept adds and removes race without duplicating", () => {
    store().toggleDemographicsConcept(DemographicConceptField.Race, white, true);
    store().toggleDemographicsConcept(DemographicConceptField.Race, white, true);
    expect(demographics()?.race).toEqual([white]);

    store().toggleDemographicsConcept(DemographicConceptField.Race, black, true);
    expect(demographics()?.race).toHaveLength(2);

    store().toggleDemographicsConcept(DemographicConceptField.Race, white, false);
    expect(demographics()?.race).toEqual([black]);
  });

  it("setDemographicsConcept replaces the whole list (select all)", () => {
    store().toggleDemographicsConcept(DemographicConceptField.Race, white, true);
    store().setDemographicsConcept(DemographicConceptField.Race, [white, black]);
    expect(demographics()?.race).toEqual([white, black]);
  });

  it("clearDemographicsConcept empties sex without touching age", () => {
    store().setDemographicsAge([0, 30]);
    store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
    store().clearDemographicsConcept(DemographicConceptField.Sex);
    expect(demographics()?.sex).toEqual([]);
    expect(demographics()?.age).toEqual([0, 30]);
  });

  it("clearDemographicsConcept empties race without touching sex", () => {
    store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
    store().toggleDemographicsConcept(DemographicConceptField.Race, white, true);
    store().clearDemographicsConcept(DemographicConceptField.Race);
    expect(demographics()?.race).toEqual([]);
    expect(demographics()?.sex).toEqual([female]);
  });

  it("keeps demographics inside queryBuilderJson (single source of truth)", () => {
    store().toggleDemographicsConcept(DemographicConceptField.Sex, male, true);
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
      store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
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
      store().toggleDemographicsConcept(DemographicConceptField.Sex, female, true);
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
