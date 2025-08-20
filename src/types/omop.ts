import { Option } from "./api";

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
