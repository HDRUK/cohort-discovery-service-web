"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, CollectionHost, Paginated } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useEffect, useMemo, useState } from "react";
import CollectionsCreatePanel from "./CollectionsCreatePanel";
import CollectionsTable from "@/components/CollectionsTable";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import CollectionsDetailPanel from "./CollectionsDetailPanel";
import { useForm } from "react-hook-form";
import { UpdateCollectionFormValues } from "@/types/forms";

const CollectionAdmin = ({
  pid,
  collections,
  collectionHosts,
}: {
  pid: string;
  collections: Paginated<CollectionWithHosts[]>;
  collectionHosts: CollectionHost[];
}) => {
  const {
    custodianData: { custodians },
  } = useDaphneStore();

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT
    );
  };

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT
    );
  };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection),
    [rowSelection]
  );

  const selectedCollection = useMemo(
    () =>
      selectedCollectionIds.length > 0
        ? collections.data.find(
            (h) =>
              h.pid === selectedCollectionIds[selectedCollectionIds.length - 1]
          )
        : null,
    [collections, selectedCollectionIds]
  );

  const custodian = custodians.find((c) => c.pid === pid);

  const { handleSubmit, control, setValue } =
    useForm<UpdateCollectionFormValues>({
      defaultValues: {
        name: "",
        description: "",
        url: "",
      },
    });

  useEffect(() => {
    if (!selectedCollection) return;
    const { name, description, url } = selectedCollection;
    setValue("name", name);
    setValue("description", description || "");
    setValue("url", url || "");
  }, [selectedCollection, setValue]);

  const submitForm = async (
    _data: UpdateCollectionFormValues,
    closeAfter = false
  ) => {
    if (!selectedCollection?.id) return;

    // to-do: dependent on missing BE and other FE tickets
    //const { id } = selectedCollection;

    // await updateCollection(id, ...);
    //notify.success(`Updated collection`);

    if (closeAfter) {
      toggleExpandRight();
    }
  };

  const handleEnter = handleSubmit((values) => submitForm(values, false));
  const handleLockClick = handleSubmit((values) => submitForm(values, true));

  const handleUnlockClick = () => {
    toggleExpandRight();
  };

  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Collections" subTitle="Create" />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        panelWidth={3}
        left={
          <CollectionsCreatePanel
            expandedLeft={expandedLeft}
            custodian={custodian}
            collectionHosts={collectionHosts}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={
          <CollectionsTable
            custodianPid={custodian.pid}
            collections={collections}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        }
        right={
          <CollectionsDetailPanel
            selectedCollection={selectedCollection || null}
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            control={control}
            handleEnter={handleEnter}
            handleLockClick={handleLockClick}
            handleUnlockClick={handleUnlockClick}
          />
        }
      />
    </Box>
  );
};

export default CollectionAdmin;
