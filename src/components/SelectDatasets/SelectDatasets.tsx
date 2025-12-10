"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { Collection, GroupedCollection } from "../../types/api";
import {
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Paper,
} from "@mui/material";
import { useEffect, useRef } from "react";
import Title from "../Title";
import SelectCustodianDatasets from "../SelectCustodianDatasets";

const SelectDatasets = ({
  initialSelection,
  collections,
}: {
  initialSelection: string[];
  collections: Collection[];
}) => {
  const { selectedDatasets, setSelectedDatasets, open } = useQueryBuilder(
    (qb) => ({
      selectedDatasets: qb.selectedDatasets,
      setSelectedDatasets: qb.setSelectedDatasets,
      open: qb.openSelectDatasetsPanel,
    })
  );

  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setSelectedDatasets(initialSelection ?? []);
  }, [initialSelection, setSelectedDatasets]);

  const groupedCollections = Object.values(
    collections.reduce<Record<number, GroupedCollection>>((acc, c) => {
      const { custodian } = c;
      (acc[custodian.id] ??= { custodian, items: [] }).items.push(c);
      return acc;
    }, {})
  );

  const nTotal = collections.length;
  const nSelected = selectedDatasets.length;

  return (
    <Collapse in={open} timeout={300}>
      <Paper
        sx={{
          my: 2,
          bgcolor: "white",
          mb: 1000,
        }}
      >
        <AccordionSummary>
          <Title
            title="All Collections"
            subTitle={`${nSelected}/${nTotal} Collections Selected`}
            useSeparator={false}
          />
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            mb: 2,
          }}
        >
          {groupedCollections.map((gc) => (
            <SelectCustodianDatasets
              key={gc.custodian.id}
              custodianCollections={gc}
            />
          ))}
        </AccordionDetails>
      </Paper>
    </Collapse>
  );
};

export default SelectDatasets;
