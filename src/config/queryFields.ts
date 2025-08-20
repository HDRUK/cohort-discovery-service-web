import { Field } from "react-querybuilder";

export const baseFields: Field[] = [
  {
    name: "sex",
    label: "Sex",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [],
  },
  {
    name: "age",
    label: "Age",
    inputType: "number",
    operators: ["=", ">", "<", ">=", "<=", "between"],
  },
  {
    name: "condition",
    label: "Condition",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [], // filled dynamically
  },
  {
    name: "measurement",
    label: "Measurement",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [], // filled dynamically
  },
  {
    name: "drug",
    label: "Drug Exposure",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [], // filled dynamically
  },
  {
    name: "observation",
    label: "Observation",
    inputType: "string",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [], // filled dynamically
  },
  {
    name: "procedure",
    label: "Procedure",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [], // filled dynamically
  },
];
