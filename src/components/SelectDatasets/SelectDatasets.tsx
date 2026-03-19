"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Collection, GroupedCollection, Network } from "../../types/api";
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
import { useEffect, useMemo, useRef } from "react";
import Title from "../Title";
import SelectNetworkDatasets, {
  NetworkGroupedCollections,
} from "../SelectNetworkDatasets";
import RefreshButton from "../RefreshButton";
import { TAG_COLLECTIONS } from "@/config/tags";
import { intersection } from "lodash";
import ToggleAction from "../ToggleAction";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUserDataStore } from "@/hooks/userDataStore";
import SquareCheckbox from "../SquareCheckbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SelectDatasets = () => {
  const collections = useUserDataStore((s) => s.userCollections);
  const initialSelection = useMemo(
    () => collections.map((c) => c.pid),
    [collections],
  );

  const includeSynthetic = useQueryBuilder((qb) => qb.includeSynthetic);
  const setIncludeSynthetic = useQueryBuilder((qb) => qb.setIncludeSynthetic);

  const selectedDatasets = useQueryBuilder((qb) => qb.selectedDatasets);
  const setSelectedDatasets = useQueryBuilder((qb) => qb.setSelectedDatasets);

  const open = useQueryBuilder((qb) => qb.openSelectDatasetsPanel);
  const setOpen = useQueryBuilder((qb) => qb.setOpenSelectDatasetsPanel);

  const previouslySelectedDatasets = useQueryBuilder(
    (qb) => qb.previouslySelectedDatasets,
  );
  const setPreviouslySelectedDatasets = useQueryBuilder(
    (qb) => qb.setPreviouslySelectedDatasets,
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

  const visibleCollections = useMemo(() => {
    return includeSynthetic
      ? collections
      : collections.filter((c) => !c.is_synthetic);
  }, [collections, includeSynthetic]);

  const visiblePids = useMemo(() => {
    return new Set(visibleCollections.map((c) => c.pid));
  }, [visibleCollections]);

  useEffect(() => {
    const filtered = selectedDatasets.filter((pid) => visiblePids.has(pid));
    if (filtered.length !== selectedDatasets.length) {
      setSelectedDatasets(filtered);
    }
  }, [selectedDatasets, visiblePids, setSelectedDatasets]);

  const custodianGroups = useMemo(() => {
    return Object.values(
      visibleCollections.reduce<Record<number, GroupedCollection>>((acc, c) => {
        const { custodian } = c;
        (acc[custodian.id] ??= { custodian, items: [] }).items.push(c);
        return acc;
      }, {}),
    );
  }, [visibleCollections]);

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

  const handleToggleIncludeSynthetic = () => {
    if (!includeSynthetic) {
      const selectedSet = new Set(selectedDatasets);

      const custodiansById = collections.reduce<Record<number, Collection[]>>(
        (acc, c) => {
          (acc[c.custodian.id] ??= []).push(c);
          return acc;
        },
        {},
      );

      const syntheticToAdd: string[] = [];

      Object.values(custodiansById).forEach((custodianCollections) => {
        const nonSynthetic = custodianCollections.filter(
          (c) => !c.is_synthetic,
        );
        const synthetic = custodianCollections.filter((c) => c.is_synthetic);

        const fullySelected =
          nonSynthetic.length > 0 &&
          nonSynthetic.every((c) => selectedSet.has(c.pid));

        if (fullySelected) {
          syntheticToAdd.push(...synthetic.map((c) => c.pid));
        }
      });

      setSelectedDatasets(
        Array.from(new Set([...selectedDatasets, ...syntheticToAdd])),
      );
    }

    setIncludeSynthetic(!includeSynthetic);
  };

  const nTotal = visibleCollections.length;
  const nSelected = selectedDatasets.filter((pid) =>
    visiblePids.has(pid),
  ).length;
  const noDatasets = nSelected === 0;

  const handleToggleAll = () => {
    const visiblePidList = Array.from(visiblePids);

    if (nSelected > 0) {
      const next = selectedDatasets.filter((pid) => !visiblePids.has(pid));
      setSelectedDatasets(next);
    } else {
      const next = Array.from(
        new Set([...selectedDatasets, ...visiblePidList]),
      );
      setSelectedDatasets(next);
    }
  };

  return (
    <Collapse in={open} timeout={300}>
      <Paper
        sx={{
          my: 2,
          bgcolor: "white",
          border: 1,
        }}
      >
        <Stack direction="row" gap={1} padding={1} marginX={2}>
          <ToggleAction
            size={25}
            active={includeSynthetic}
            onToggle={handleToggleIncludeSynthetic}
            activeIcon={CheckIcon}
            inactiveIcon={CloseIcon}
          />
          <Title
            title="Include"
            subTitle={"Synthetic Data Collections"}
            useSeparator={false}
          />
        </Stack>

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
              title="All Collections"
              subTitle={`${nSelected}/${nTotal} Collections Selected`}
              useSeparator={false}
              wrapperSx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
              startIcon={
                <SquareCheckbox
                  checked={nSelected > 0}
                  indeterminate={nSelected > 0 && nSelected !== nTotal}
                  onChange={() => {
                    handleToggleAll();
                  }}
                />
              }
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
        </Accordion>
      </Paper>
    </Collapse>
  );
};

export default SelectDatasets;
