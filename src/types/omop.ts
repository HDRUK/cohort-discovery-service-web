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
}

export type DomainVerb = {
  verb: string;
  past: string;
  noun: string;
  include: string;
  exclude: string;
};

export const DEFAULT_DOMAIN_VERB: DomainVerb = {
  verb: "record",
  past: "was recorded",
  noun: "record",
  include: "were associated with",
  exclude: "were not associated with",
};

export const DOMAIN_VERBS: Record<string, DomainVerb> = {
  condition: {
    verb: "diagnose",
    past: "was diagnosed",
    noun: "diagnosis",
    include: "were diagnosed with",
    exclude: "were not diagnosed with",
  },
  drug: {
    verb: "take",
    past: "was taken",
    noun: "drug",
    include: "received",
    exclude: "did not receive",
  },
  procedure: {
    verb: "perform",
    past: "was performed",
    noun: "procedure",
    include: "underwent",
    exclude: "did not undergo",
  },
  measurement: {
    verb: "measure",
    past: "was measured",
    noun: "measurement",
    include: "were measured with",
    exclude: "were not measured with",
  },
  observation: {
    verb: "observe",
    past: "was observed",
    noun: "observation",
    include: "were observed with",
    exclude: "were not observed with",
  },
  device: {
    verb: "expose",
    past: "was exposed",
    noun: "device",
    include: "were exposed to",
    exclude: "were not exposed to",
  },
  visit: {
    verb: "visit",
    past: "had a visit",
    noun: "visit",
    include: "had",
    exclude: "did not have",
  },
  death: {
    verb: "die",
    past: "died",
    noun: "death",
    include: "died",
    exclude: "did not die",
  },
  specimen: {
    verb: "collect",
    past: "was collected",
    noun: "specimen",
    include: "had a specimen collected",
    exclude: "did not have a specimen collected",
  },
  gender: {
    verb: "record",
    past: "was recorded",
    noun: "sex", //consistent with domain mapping
    include: "were recorded as having",
    exclude: "were not recorded as having",
  },
  race: {
    verb: "record",
    past: "was recorded",
    noun: "race",
    include: "were recorded as having",
    exclude: "were not recorded as having",
  },
  ethnicity: {
    verb: "record",
    past: "was recorded",
    noun: "ethnicity",
    include: "were recorded as having",
    exclude: "were not recorded as having",
  },
};
