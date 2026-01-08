"use client";

import UpdateCollectionMdx from "@/content/guidance/updateMultipleCollections.mdx";
import { Stack } from "@mui/material";
import FormLabel from "@/components/FormLabel";

const UpdateMultipleCollectionsGuidance = () => {
  return (
    <Stack>
      <FormLabel underlined>Workgroup Guidance</FormLabel>
      <UpdateCollectionMdx />
    </Stack>
  );
};

export default UpdateMultipleCollectionsGuidance;
