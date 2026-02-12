"use client";

import UpdateCollectionMdx from "@/content/guidance/custodianAdmin/updateCollection.mdx";
import { Stack } from "@mui/material";
import FormLabel from "@/components/FormLabel";

const UpdateCollectionGuidance = () => {
  return (
    <Stack>
      <FormLabel underlined>Guidance</FormLabel>
      <UpdateCollectionMdx />
    </Stack>
  );
};

export default UpdateCollectionGuidance;
