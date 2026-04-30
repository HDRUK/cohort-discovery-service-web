import { Option } from "./common";

export const DEFAULT_SEXES: Option[] = [
  { name: "8507", label: "Male (8507)" },
  { name: "8532", label: "Female (8532)" },
  { name: "8551", label: "Other (8551)" },
];

export enum OmopTableName {
  Sex = "sex",
  Condition = "condition",
  Drug = "drug",
  Measurement = "measurement",
  Observation = "observation",
  Procedure = "procedure",
  Device = "device",
  Visit = "visit",
  Death = "death",
  Specimen = "specimen",
  Gender = "gender",
  Race = "race",
  Ethnicity = "ethnicity",
}

export type DomainPhrase = {
  verb: string;
  past: string;
  noun: string;
  include: string;
  exclude: string;
};

export const DEFAULT_DOMAIN_PHRASE: DomainPhrase = {
  verb: "record",
  past: "was recorded",
  noun: "record",
  include: "were associated with",
  exclude: "were not associated with",
};

export const DOMAIN_PHRASES: Record<OmopTableName, DomainPhrase> = {
  [OmopTableName.Sex]: {
    verb: "record",
    past: "was recorded",
    noun: "sex",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Gender]: {
    verb: "record",
    past: "was recorded",
    noun: "sex",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Condition]: {
    verb: "diagnose",
    past: "was diagnosed",
    noun: "diagnosis",
    include: "were diagnosed with",
    exclude: "were not diagnosed with",
  },
  [OmopTableName.Drug]: {
    verb: "take",
    past: "was taken",
    noun: "medication",
    include: "received",
    exclude: "did not receive",
  },
  [OmopTableName.Measurement]: {
    verb: "measure",
    past: "was measured",
    noun: "measurement",
    include: "were measured with",
    exclude: "were not measured with",
  },
  [OmopTableName.Observation]: {
    verb: "observe",
    past: "was observed",
    noun: "observation",
    include: "were observed with",
    exclude: "were not observed with",
  },
  [OmopTableName.Procedure]: {
    verb: "perform",
    past: "was performed",
    noun: "procedure",
    include: "underwent",
    exclude: "did not undergo",
  },
  [OmopTableName.Device]: {
    verb: "expose",
    past: "was exposed",
    noun: "device",
    include: "were exposed to",
    exclude: "were not exposed to",
  },
  [OmopTableName.Visit]: {
    verb: "visit",
    past: "had a visit",
    noun: "visit",
    include: "had",
    exclude: "did not have",
  },
  [OmopTableName.Death]: {
    verb: "die",
    past: "died",
    noun: "death",
    include: "died",
    exclude: "did not die",
  },
  [OmopTableName.Specimen]: {
    verb: "collect",
    past: "was collected",
    noun: "specimen",
    include: "had a specimen collected",
    exclude: "did not have a specimen collected",
  },
  [OmopTableName.Race]: {
    verb: "record",
    past: "was recorded",
    noun: "race",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Ethnicity]: {
    verb: "record",
    past: "was recorded",
    noun: "ethnicity",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
};
