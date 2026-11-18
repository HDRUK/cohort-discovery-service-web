"use client";

import { useTransition } from "react";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMetadataFormContext } from "@hdruk/metadata-onboard/client";
import saveCollectionMetadata from "@/actions/collection/saveCollectionMetadata";
import { QUERY_KEYS } from "@/config/tags";
import { useNotify } from "@/providers/NotifyProvider";

interface SaveMetadataButtonProps {
  collectionId: number;
  pid: string;
}

const SaveMetadataButton = ({ collectionId, pid }: SaveMetadataButtonProps) => {
  const { validate, getDocument } = useMetadataFormContext();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [isSaving, startSaving] = useTransition();

  const save = () => {
    if (!validate()) {
      notify.error(
        "Some metadata fields need fixing — check the highlighted fields and save again",
      );
      return;
    }

    startSaving(async () => {
      const result = await saveCollectionMetadata(collectionId, getDocument());
      if (result.error) {
        notify.error(`The metadata wasn't saved: ${result.error.text}`);
        return;
      }
      notify.success("Collection metadata saved");
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.collectionMetadata(pid),
      });
    });
  };

  return (
    <Button
      type="button"
      variant="contained"
      onClick={save}
      disabled={isSaving}
      sx={{ alignSelf: "flex-end" }}
    >
      Save metadata
    </Button>
  );
};

export default SaveMetadataButton;
