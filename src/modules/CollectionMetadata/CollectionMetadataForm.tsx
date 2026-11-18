"use client";

import { Skeleton, Stack, Typography } from "@mui/material";
import {
  MetadataFormProvider,
  SchemaSections,
} from "@hdruk/metadata-onboard/client";
import SaveMetadataButton from "./SaveMetadataButton";
import {
  useCollectionMetadata,
  useCollectionSchema,
} from "./useCollectionMetadata";

interface CollectionMetadataFormProps {
  collectionId: number;
  pid: string;
}

const CollectionMetadataForm = ({
  collectionId,
  pid,
}: CollectionMetadataFormProps) => {
  const schema = useCollectionSchema();
  const record = useCollectionMetadata(pid);

  if (schema.isPending || record.isPending) {
    return <Skeleton variant="rectangular" height={300} />;
  }

  if (!schema.data || !record.data) {
    return (
      <Typography color="error">
        The collection&apos;s metadata couldn&apos;t be loaded. Refresh the page
        to try again.
      </Typography>
    );
  }

  return (
    <MetadataFormProvider
      key={record.dataUpdatedAt}
      schema={schema.data.schema}
      values={record.data.metadata ?? {}}
    >
      <Stack gap={2}>
        <SchemaSections />
        <SaveMetadataButton collectionId={collectionId} pid={pid} />
      </Stack>
    </MetadataFormProvider>
  );
};

export default CollectionMetadataForm;
