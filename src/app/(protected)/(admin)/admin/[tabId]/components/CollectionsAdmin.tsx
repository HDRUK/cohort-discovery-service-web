"use client";
import { useState, useMemo, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, Paginated } from "@/types/api";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import { useNotify } from "@/providers/NotifyProvider";
import { useForm } from "react-hook-form";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import CollectionCreatePanel from "./CollectionCreatePanel";
import CollectionManagePanel from "./CollectionManagePanel";
import CollectionsListPanel from "./CollectionsListPanel";
// import CollectionHostDetailPanel from "./CollectionHostDetailPanel";

type CollectionHostFormValues = { hostName: string };

const CollectionsAdmin = ({
  collections,
}: {
  collections: Paginated<CollectionWithHosts[]>;
}) => {
  const notify = useNotify();
  const {
    adminData: { updateCollection, deleteCollection },
  } = useDaphneStore();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection),
    [rowSelection]
  );

  // const selectedCollectionHost = useMemo(
  //   () =>
  //     selectedHostIds.length > 0
  //       ? collectionHosts.find((h) => h.client_id === selectedHostIds[0])
  //       : null,
  //   [collectionHosts, selectedHostIds]
  // );

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);

  const toggleExpandLeft = () => {
    setRowSelection({});
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT
    );
  };

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT
    );
  };

  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  // const custodian = custodians.find((c) => c.pid === pid);
  const noCollections = collections.length === 0;

  // const { handleSubmit, control, setValue } =
  //   useForm<CollectionHostFormValues>({
  //     defaultValues: {
  //       hostName: selectedCollectionHost?.name,
  //     },
  //   });

  // useEffect(() => {
  //   if (selectedCollectionHost)
  //     setValue("hostName", selectedCollectionHost.name);
  // }, [selectedCollectionHost, setValue]);

  // const submitHostForm = async (
  //   { hostName }: CollectionHostFormValues,
  //   closeAfter = false
  // ) => {
  //   if (!selectedCollectionHost?.id) return;
  //   const { id } = selectedCollectionHost;

  //   if (hostName !== selectedCollectionHost.name) {
  //     await updateCollectionHost(id, { name: hostName });
  //     notify.success(`Updated host name ${hostName}`);
  //   }

  //   if (closeAfter) {
  //     toggleExpandRight();
  //   }
  // };

  // const handleEnter = handleSubmit((values) => submitHostForm(values, false));
  // const handleLockClick = handleSubmit((values) =>
  //   submitHostForm(values, true)
  // );

  // const handleUnlockClick = () => {
  //   toggleExpandRight();
  // };

  const handleDeleteCollection = async () => {
    selectedCollectionIds.map((id) => {
      if (id) {
        deleteCollection(+id, ""); // TODO: need to supply true custodian pid, or find another way to revalidate the cache without it
      } else {
        notify.warning(`Did not find collection ${id} to delete`);
      }
    });

    notify.success(`Deleted ${selectedCollectionIds.length} collections`);
    setRowSelection({});
  };

  // if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      <Title title="Collections" subTitle="Management" />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        panelWidth={3}
        left={
          <CollectionCreatePanel
            //   custodianId={custodian.id}
            expandedLeft={expandedLeft}
            onCreateNewHost={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={
          <CollectionsListPanel
            noCollections={noCollections}
            collections={collections}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onDeleteCollection={handleDeleteCollection}
            hasSelection={selectedCollectionIds.length > 0}
          />
        }
        right={
          //   <CollectionHostDetailPanel
          //     selectedCollectionHost={selectedCollectionHost || null}
          //     expandedRight={expandedRight}
          //     expandedLeft={expandedLeft}
          //     control={control}
          //     handleEnter={handleEnter}
          //     handleLockClick={handleLockClick}
          //     handleUnlockClick={handleUnlockClick}
          //   />
          <></>
        }
      />
    </Box>
  );
};

export default CollectionsAdmin;
