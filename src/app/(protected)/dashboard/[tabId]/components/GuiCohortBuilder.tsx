"use server";

import CohortQueryInput from "@/components/CohortQueryInput";
import getCollections from "@/actions/getCollections";
import { getAllFields } from "@/actions/omop/getAllCodes";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import CohortWorkbench from "./CohortWorkbench";

const GuiCohortBuilder = async () => {
  const fields = await getAllFields();
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <>
      <CohortQueryTitle />
      <CohortQueryInput fields={fields} />

      <CohortWorkbench
        fields={fields}
        collections={activeCollections}
        initialSelection={initialSelection}
      />
    </>
  );
};

export default GuiCohortBuilder;
