"use client";

import UpdateCollectionMdx from "@/content/guidance/updateCollection.mdx";
import { Stack } from "@mui/material";
import FormLabel from "@/components/FormLabel";

const UpdateCollectionGuidance = () => {
  return (
    <Stack>
      <FormLabel labelUnderlined>Guidance</FormLabel>
      <UpdateCollectionMdx />
    </Stack>
  );
};

export default UpdateCollectionGuidance;
