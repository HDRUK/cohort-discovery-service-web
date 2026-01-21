"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { GroupedCollection } from "../../types/api";
import {
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Title from "../Title";
import SquareCheckbox from "../SquareCheckbox";

const SelectCustodianDatasets = ({
  custodianCollections,
}: {
  custodianCollections: GroupedCollection;
}) => {
  const { selectedDatasets, setSelectedDatasets } = useQueryBuilder((qb) => ({
    selectedDatasets: qb.selectedDatasets,
    setSelectedDatasets: qb.setSelectedDatasets,
  }));

  const nTotal = custodianCollections.items.length;
  const nSelected = selectedDatasets.filter((pid) =>
    custodianCollections.items.map((i) => i.pid).includes(pid),
  ).length;

  const handleSelectDataset = (pid: string) => {
    const next = selectedDatasets.includes(pid)
      ? selectedDatasets.filter((x) => x !== pid)
      : [...selectedDatasets, pid];
    setSelectedDatasets(next);
  };

  const handleSelectAll = () => {
    if (nSelected > 0) {
      const ids = custodianCollections.items.map((i) => i.pid);
      const next = selectedDatasets.filter((pid) => !ids.includes(pid));
      setSelectedDatasets(next);
      return;
    }
    const ids = custodianCollections.items.map((i) => i.pid);
    const next = Array.from(new Set([...selectedDatasets, ...ids]));
    setSelectedDatasets(next);
  };

  return (
    <Accordion
      defaultExpanded={true}
      disableGutters
      elevation={1}
      square
      sx={{
        bgcolor: "white",
        m: 2,
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
                handleSelectAll();
              }}
            />
          }
          title={custodianCollections.custodian.name}
          subTitle={`${nSelected}/${nTotal} Collections Selected`}
          useSeparator={false}
        />
      </AccordionSummary>

      <AccordionDetails
        sx={{
          p: 0,
          mx: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          border: 1,
          borderRadius: 1,
          borderColor: "lightgrey",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
          {custodianCollections.items.map((c) => (
            <Chip
              size="small"
              variant="outlined"
              sx={{ borderRadius: 10, py: 2 }}
              key={c.id}
              label={
                <FormControlLabel
                  control={
                    <SquareCheckbox
                      onChange={() => handleSelectDataset(c.pid)}
                      checked={selectedDatasets.includes(c.pid)}
                    />
                  }
                  label={c.name}
                />
              }
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SelectCustodianDatasets;
