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
  verbPast: string;
  pastPrefix: string;
  noun: string;
  include: string;
  exclude: string;
};

export const getPastPhrase = ({ pastPrefix, verbPast }: DomainPhrase): string =>
  [pastPrefix, verbPast].filter(Boolean).join(" ");

export const DEFAULT_DOMAIN_PHRASE: DomainPhrase = {
  verb: "record",
  verbPast: "recorded",
  pastPrefix: "was",
  noun: "record",
  include: "were associated with",
  exclude: "were not associated with",
};

export const DOMAIN_PHRASES: Record<OmopTableName, DomainPhrase> = {
  [OmopTableName.Sex]: {
    verb: "record",
    verbPast: "recorded",
    pastPrefix: "was",
    noun: "sex",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Condition]: {
    verb: "diagnose",
    verbPast: "diagnosed",
    pastPrefix: "was",
    noun: "diagnosis",
    include: "were diagnosed with",
    exclude: "were not diagnosed with",
  },
  [OmopTableName.Drug]: {
    verb: "take",
    verbPast: "taken",
    pastPrefix: "was",
    noun: "medication",
    include: "received",
    exclude: "did not receive",
  },
  [OmopTableName.Measurement]: {
    verb: "measure",
    verbPast: "measured",
    pastPrefix: "was",
    noun: "measurement",
    include: "were measured with",
    exclude: "were not measured with",
  },
  [OmopTableName.Observation]: {
    verb: "observe",
    verbPast: "observed",
    pastPrefix: "was",
    noun: "observation",
    include: "were observed with",
    exclude: "were not observed with",
  },
  [OmopTableName.Procedure]: {
    verb: "perform",
    verbPast: "performed",
    pastPrefix: "was",
    noun: "procedure",
    include: "underwent",
    exclude: "did not undergo",
  },
  [OmopTableName.Device]: {
    verb: "expose",
    verbPast: "exposed",
    pastPrefix: "was",
    noun: "device",
    include: "were exposed to",
    exclude: "were not exposed to",
  },
  [OmopTableName.Visit]: {
    verb: "visit",
    verbPast: "visit",
    pastPrefix: "had a",
    noun: "visit",
    include: "had",
    exclude: "did not have",
  },
  [OmopTableName.Death]: {
    verb: "die",
    verbPast: "died",
    pastPrefix: "",
    noun: "death",
    include: "died",
    exclude: "did not die",
  },
  [OmopTableName.Specimen]: {
    verb: "collect",
    verbPast: "collected",
    pastPrefix: "was",
    noun: "specimen",
    include: "had a specimen collected",
    exclude: "did not have a specimen collected",
  },
  [OmopTableName.Gender]: {
    verb: "record",
    verbPast: "recorded",
    pastPrefix: "was",
    noun: "gender",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Race]: {
    verb: "record",
    verbPast: "recorded",
    pastPrefix: "was",
    noun: "race",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
  [OmopTableName.Ethnicity]: {
    verb: "record",
    verbPast: "recorded",
    pastPrefix: "was",
    noun: "ethnicity",
    include: "were recorded as being",
    exclude: "were not recorded as being",
  },
};
