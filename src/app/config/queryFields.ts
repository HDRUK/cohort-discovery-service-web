import { Field } from "react-querybuilder";

export const baseFields: Field[] = [
  {
    name: "sex",
    label: "Sex",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [
      { name: "8507", label: "Male" },
      { name: "8532", label: "Female" },
      { name: "8551", label: "Other" },
    ],
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
    inputType: "string",
    operators: ["=", "!=", ">", "<", ">=", "<=", "between"],
    values: [
      { name: "bmi", label: "BMI" },
      { name: "systolic_bp", label: "Systolic Blood Pressure" },
      { name: "a1c", label: "HbA1c (%)" },
      { name: "cholesterol", label: "Total Cholesterol (mg/dL)" },
    ],
  },
  {
    name: "drug_exposure",
    label: "Drug Exposure",
    inputType: "string",
    operators: ["=", "!="],
    values: [
      { name: "metformin", label: "Metformin" },
      { name: "insulin", label: "Insulin" },
      { name: "atorvastatin", label: "Atorvastatin" },
    ],
  },
  {
    name: "observation",
    label: "Observation",
    inputType: "string",
    operators: ["=", "!="],
    values: [
      { name: "former_smoker", label: "Former Smoker" },
      { name: "family_history_diabetes", label: "Family History of Diabetes" },
      { name: "wheelchair", label: "Uses Wheelchair" },
    ],
  },
];
