"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { GroupedCollection, Network } from "../../types/api";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Title from "../Title";
import SelectCustodianDatasets from "../SelectCustodianDatasets";
import SquareCheckbox from "../SquareCheckbox";

export type NetworkGroupedCollections = {
  network: Network | null;
  custodians: GroupedCollection[];
};

const SelectNetworkDatasets = ({
  networkCollections,
}: {
  networkCollections: NetworkGroupedCollections;
}) => {
  const { selectedDatasets, setSelectedDatasets } = useQueryBuilder((qb) => ({
    selectedDatasets: qb.selectedDatasets,
    setSelectedDatasets: qb.setSelectedDatasets,
  }));

  // All collections in this network (across all custodians)
  const allCollections = networkCollections.custodians.flatMap(
    (gc) => gc.items,
  );
  const allPids = allCollections.map((c) => c.pid);

  const nTotal = allCollections.length;
  const nSelected = selectedDatasets.filter((pid) =>
    allPids.includes(pid),
  ).length;

  const handleSelectNetwork = () => {
    if (nSelected > 0) {
      const next = selectedDatasets.filter((pid) => !allPids.includes(pid));
      setSelectedDatasets(next);
    } else {
      const next = Array.from(new Set([...selectedDatasets, ...allPids]));
      setSelectedDatasets(next);
    }
  };

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={1}
      square
      sx={{
        bgcolor: "white",
        m: 2,
        border: 1,
        borderRadius: 1,
        borderColor: "lightgrey",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Title
          size="small"
          startIcon={
            <SquareCheckbox
              checked={nSelected > 0}
              indeterminate={nSelected > 0 && nSelected !== nTotal}
              onChange={() => {
                handleSelectNetwork();
              }}
            />
          }
          title={networkCollections.network?.name ?? "No network"}
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
          mb: 1,
          mx: 3,
          border: 1,
          borderRadius: 1,
          borderColor: "lightgrey",
        }}
      >
        {networkCollections.custodians.map((gc) => (
          <SelectCustodianDatasets
            key={gc.custodian.id}
            custodianCollections={gc}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default SelectNetworkDatasets;
