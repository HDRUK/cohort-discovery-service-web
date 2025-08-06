"use server";

import { baseFields } from "@/config/queryFields";
import getCodes from "./getCodes";
import { codesToOption } from "@/utils/omop";
import { Code, Option } from "@/types/api";
import { Field } from "react-querybuilder";

import { OmopTableName, DEFAULT_SEXES } from "@/types/omop";

export const getAllCodes = async (): Promise<Record<OmopTableName, Code[]>> => {
  return await Object.values(OmopTableName).reduce<
    Promise<Record<OmopTableName, Code[]>>
  >(async (accPromise, table) => {
    const acc = await accPromise;
    const codes = await getCodes(table);
    acc[table] = codes.data;
    return acc;
  }, Promise.resolve({} as Record<OmopTableName, Code[]>));
};

export const getAllOmopOptions = async (): Promise<
  Record<OmopTableName, Option[]>
> => {
  const allCodes = await getAllCodes();

  const allOptions = Object.keys(allCodes).reduce((acc, table) => {
    acc[table as OmopTableName] = codesToOption(
      allCodes[table as OmopTableName]
    );
    return acc;
  }, {} as Record<OmopTableName, Option[]>);

  return allOptions;
};

export const getAllFields = async (): Promise<Field[]> => {
  const omopOptions = await getAllOmopOptions();
  const hydratedFields = baseFields.map((field) => {
    if (field.name === "sex") {
      return { ...field, values: DEFAULT_SEXES } as Field;
    }
    const newValues = omopOptions[field.name as OmopTableName] ?? [];
    if (newValues && newValues.length > 0) {
      return { ...field, values: newValues } as Field;
    }

    return field;
  });
  return hydratedFields;
};
