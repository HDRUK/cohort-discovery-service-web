"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { GroupedCollection, Network } from "@/types/api";
import {
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Paper,
  Box,
  Button,
  Stack,
  Accordion,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import Title from "../Title";
import SelectNetworkDatasets, {
  NetworkGroupedCollections,
} from "../SelectNetworkDatasets";
import RefreshButton from "../RefreshButton";
import { TAG_COLLECTIONS } from "@/config/tags";
import ToggleAction from "../ToggleAction";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUserDataStore } from "@/hooks/userDataStore";
import SquareCheckbox from "../SquareCheckbox";
import { addPids, removePids } from "@/utils/collections";
import SearchBox from "../SearchBox";
import { useDebounce } from "@/hooks/useDebounce";

const SelectDatasets = () => {
  const collections = useUserDataStore((s) => s.userCollections);
  const selectedDatasets = useQueryBuilder((qb) => qb.selectedDatasets);
  const setSelectedDatasets = useQueryBuilder((qb) => qb.setSelectedDatasets);
  const hasSelectedSyntheticDatasets = useQueryBuilder(
    (qb) => qb.hasSelectedSyntheticDatasets,
  );

  const open = useQueryBuilder((qb) => qb.openSelectDatasetsPanel);
  const setOpen = useQueryBuilder((qb) => qb.setOpenSelectDatasetsPanel);

  const previouslySelectedDatasets = useQueryBuilder(
    (qb) => qb.previouslySelectedDatasets,
  );
  const setPreviouslySelectedDatasets = useQueryBuilder(
    (qb) => qb.setPreviouslySelectedDatasets,
  );

  //refactor candidate to use an endpoint to search for collections
  // - we always want to be aware of all user accessible collections though
  //   that's why we can just filter these on the FE
  const [searchTerm, setSearchTerm] = useState<string>();

  const { debounced: debouncedSearchTerm } = useDebounce(searchTerm, {});

  const filteredCollections = useMemo(() => {
    const searchTerm = debouncedSearchTerm?.trim().toLowerCase();
    if (searchTerm && searchTerm.length > 2) {
      return collections.filter((c) =>
        c.name.toLowerCase().includes(searchTerm),
      );
    }
    return collections;
  }, [collections, debouncedSearchTerm]);

  const custodianGroups = useMemo(() => {
    return Object.values(
      filteredCollections.reduce<Record<number, GroupedCollection>>(
        (acc, c) => {
          const { custodian } = c;
          (acc[custodian.id] ??= { custodian, items: [] }).items.push(c);
          return acc;
        },
        {},
      ),
    );
  }, [filteredCollections]);

  const networkGroups: NetworkGroupedCollections[] = useMemo(() => {
    return Object.values(
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
  }, [custodianGroups]);

  const allPids = useMemo(() => collections.map((c) => c.pid), [collections]);

  const allSyntheticPids = useMemo(
    () =>
      collections
        .filter((collection) => collection.is_synthetic)
        .map((c) => c.pid),
    [collections],
  );

  const selectedSet = useMemo(
    () => new Set(selectedDatasets),
    [selectedDatasets],
  );
  const allPidSet = useMemo(() => new Set(allPids), [allPids]);
  const allSyntheticPidSet = useMemo(
    () => new Set(allSyntheticPids),
    [allSyntheticPids],
  );

  const nTotal = allPids.length;
  const nSelected = allPids.filter((pid) => selectedSet.has(pid)).length;
  const nSyntheticSelected = allSyntheticPids.filter((pid) =>
    selectedSet.has(pid),
  ).length;

  const noDatasets = nSelected === 0;
  const allSelected = nTotal > 0 && nSelected === nTotal;
  const allSyntheticSelected =
    allSyntheticPids.length > 0 &&
    nSyntheticSelected === allSyntheticPids.length;

  const handleToggleIncludeSynthetic = useCallback(() => {
    const next = allSyntheticSelected
      ? removePids(selectedDatasets, allSyntheticPidSet)
      : addPids(selectedDatasets, allSyntheticPids);

    setSelectedDatasets(next);
  }, [
    allSyntheticSelected,
    allSyntheticPidSet,
    allSyntheticPids,
    selectedDatasets,
    setSelectedDatasets,
  ]);

  const handleToggleAll = useCallback(() => {
    const next = allSelected
      ? removePids(selectedDatasets, allPidSet)
      : addPids(selectedDatasets, allPids);

    setSelectedDatasets(next);
  }, [allSelected, allPidSet, allPids, selectedDatasets, setSelectedDatasets]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <Collapse
      in={open}
      timeout={300}
      sx={{
        ...(open && {
          mt: 2,
          mb: 2,
        }),
      }}
    >
      <Paper
        sx={{
          flex: 1,
          minHeight: 0,
          flexDirection: "column",
          bgcolor: "white",
        }}
      >
        <Stack direction="row" gap={1} padding={2}>
          <ToggleAction
            size={25}
            active={hasSelectedSyntheticDatasets}
            onToggle={handleToggleIncludeSynthetic}
            activeIcon={CheckIcon}
            inactiveIcon={CloseIcon}
          />
          <Title
            title={hasSelectedSyntheticDatasets ? "Including" : "Excluding"}
            subTitle={"Synthetic Data Collections"}
            useSeparator={false}
          />
        </Stack>

        <Accordion
          defaultExpanded
          disableGutters
          elevation={1}
          sx={{
            bgcolor: "white",
            mb: 1,
            maxHeight: 500,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <AccordionSummary>
            <Title
              title="All Collections"
              subTitle={`${nSelected}/${nTotal} Collections Selected`}
              startIcon={
                <SquareCheckbox
                  checked={nSelected > 0}
                  indeterminate={nSelected > 0 && nSelected !== nTotal}
                  onChange={() => {
                    handleToggleAll();
                  }}
                />
              }
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
              mb: 1,
              mx: 3,
              borderLeft: 1,
              borderColor: "lightgrey",
            }}
          >
            <Box sx={{ mx: 2 }}>
              <SearchBox
                placeholder="I'm looking for..."
                collapsible={false}
                inputBgColor="background.default"
                onChange={handleSearch}
              />
            </Box>
            {networkGroups
              .sort((a, b) =>
                (a.network?.name ?? "").localeCompare(b.network?.name ?? ""),
              )
              .map((ng) => (
                <SelectNetworkDatasets
                  key={ng.network?.id ?? "no-network"}
                  networkCollections={ng}
                />
              ))}
          </AccordionDetails>
        </Accordion>

        <Paper>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            paddingX={3.75}
            paddingY={2.5}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "black", fontWeight: "normal" }}
              onClick={() => {
                setSelectedDatasets(previouslySelectedDatasets);
                setOpen(!open);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={noDatasets}
              variant="contained"
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                fontWeight: "normal",
              }}
              onClick={() => {
                setPreviouslySelectedDatasets(selectedDatasets);
                setOpen(!open);
              }}
            >
              Save and Close
            </Button>
          </Box>
        </Paper>
      </Paper>
    </Collapse>
  );
};

export default SelectDatasets;
