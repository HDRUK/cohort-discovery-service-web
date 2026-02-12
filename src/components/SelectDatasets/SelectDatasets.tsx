"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Collection, GroupedCollection, Network } from "../../types/api";
import {
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Paper,
} from "@mui/material";
import { useEffect, useRef } from "react";
import Title from "../Title";
import SelectNetworkDatasets, {
  NetworkGroupedCollections,
} from "../SelectNetworkDatasets";
import RefreshButton from "../RefreshButton";
import { TAG_COLLECTIONS } from "@/config/tags";
import { intersection } from "lodash";

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
    }),
  );

  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (selectedDatasets.length === 0) {
      setSelectedDatasets(initialSelection ?? []);
    } else {
      setSelectedDatasets(intersection(initialSelection, selectedDatasets));
    }
  }, [selectedDatasets, initialSelection, setSelectedDatasets]);

  const custodianGroups = Object.values(
    collections.reduce<Record<number, GroupedCollection>>((acc, c) => {
      const { custodian } = c;
      (acc[custodian.id] ??= { custodian, items: [] }).items.push(c);
      return acc;
    }, {}),
  );

  const networkGroups: NetworkGroupedCollections[] = Object.values(
    custodianGroups.reduce<Record<string, NetworkGroupedCollections>>(
      (acc, gc) => {
        const network: Network | null = gc.custodian.network ?? null;
        const key = network ? String(network.id) : "no-network";

        if (!acc[key]) {
          acc[key] = { network, custodians: [] };
        }

        acc[key].custodians.push(gc);
        return acc;
      },
      {},
    ),
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
            wrapperSx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <RefreshButton component="div" tag={TAG_COLLECTIONS} />
          </Title>
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
          {networkGroups.map((ng) => (
            <SelectNetworkDatasets
              key={ng.network?.id ?? "no-network"}
              networkCollections={ng}
            />
          ))}
        </AccordionDetails>
      </Paper>
    </Collapse>
  );
};

export default SelectDatasets;
