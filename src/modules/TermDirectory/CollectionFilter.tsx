"use client";

import {
  Box,
  Chip,
  FormControlLabel,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { filterDatasetChipSx } from "@/components/FilterDatasets/FilterDatasets";
import SearchBox from "@/components/SearchBox";
import SquareCheckbox from "@/components/SquareCheckbox";
import Title from "@/components/Title";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserDataStore } from "@/hooks/userDataStore";
import useSearchParams from "@/hooks/useSearchParams";
import { GroupedCollection } from "@/types/api";

const COLLECTIONS_PARAM = "collections";

const CollectionFilter = () => {
  const { searchParams, setSearchParams } = useSearchParams();
  const userCollections = useUserDataStore((state) => state.userCollections);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>();
  const { debounced: debouncedSearchTerm } = useDebounce(searchTerm, {});

  const selectedPids = useMemo(
    () => searchParams.get(COLLECTIONS_PARAM)?.split(",") ?? [],
    [searchParams],
  );

  const filteredCollections = useMemo(() => {
    const term = debouncedSearchTerm?.trim().toLowerCase();
    if (term && term.length > 2) {
      return userCollections.filter((collection) =>
        collection.name.toLowerCase().includes(term),
      );
    }
    return userCollections;
  }, [userCollections, debouncedSearchTerm]);

  const groupedCollections = useMemo(
    () =>
      Object.values(
        filteredCollections.reduce<Record<number, GroupedCollection>>(
          (acc, collection) => {
            const { custodian } = collection;
            (acc[custodian.id] ??= { custodian, items: [] }).items.push(
              collection,
            );
            return acc;
          },
          {},
        ),
      ),
    [filteredCollections],
  );

  const toggleCollection = useCallback(
    (pid: string) => {
      const next = selectedPids.includes(pid)
        ? selectedPids.filter((selected) => selected !== pid)
        : [...selectedPids, pid];

      setSearchParams({
        [COLLECTIONS_PARAM]: next.length ? next.join(",") : null,
        page: "1",
      });
    },
    [selectedPids, setSearchParams],
  );

  const open = Boolean(anchorEl);

  return (
    <Title title="Filter" subTitle="Collections">
      <Chip
        aria-label="Filter by collection"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          bgcolor: open ? "secondary.main" : "white",
          color: open ? "secondary.contrastText" : "inherit",
          ...filterDatasetChipSx,
        }}
        label={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "baseline",
              flexWrap: "nowrap",
            }}
          >
            {selectedPids.length > 0 && (
              <Chip
                label={selectedPids.length}
                sx={{
                  bgcolor: "background.default",
                  color: "background.contrastText",
                  borderRadius: 10,
                  mr: 0.5,
                }}
              />
            )}
            <Typography variant="body1" color="inherit">
              {selectedPids.length > 0 ? "Selected" : "All"}
            </Typography>
          </Box>
        }
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Stack
          sx={{ p: 2, gap: 0.5, minWidth: 320, maxHeight: 400, overflow: "auto" }}
        >
          <SearchBox
            placeholder="I'm looking for..."
            collapsible={false}
            inputBgColor="background.default"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {groupedCollections.map(({ custodian, items }) => (
            <Stack key={custodian.id} sx={{ gap: 0.5, mt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {custodian.name}
              </Typography>
              {items.map((collection) => (
                <FormControlLabel
                  key={collection.pid}
                  control={
                    <SquareCheckbox
                      checked={selectedPids.includes(collection.pid)}
                      onChange={() => toggleCollection(collection.pid)}
                    />
                  }
                  label={collection.name}
                />
              ))}
            </Stack>
          ))}
          {!filteredCollections.length && (
            <Typography>No collections found.</Typography>
          )}
        </Stack>
      </Popover>
    </Title>
  );
};

export default CollectionFilter;
