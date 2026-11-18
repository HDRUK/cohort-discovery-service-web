import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Box, Divider } from "@mui/material";
import { MetadataView } from "@hdruk/gwdm-view";
import SkeletonFull from "@/components/SkeletonFull";
import Title from "@/components/Title";
import { personalDataPaths } from "@/modules/CollectionMetadata/collectionMetadata";
import {
  getCachedCollectionMetadata,
  getCachedCollectionSchema,
} from "@/server/data/collections";
import { isStandalone } from "@/utils/modes";
import { isPid } from "@/utils/routeParams";

const applicationMode = process.env.APPLICATION_MODE;

const CollectionLanding = async ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  if (!isStandalone(applicationMode)) notFound();

  const { pid } = await params;
  if (!isPid(pid)) notFound();

  const [{ data: collection }, { data: schema }] = await Promise.all([
    getCachedCollectionMetadata(pid),
    getCachedCollectionSchema(),
  ]);

  return (
    <>
      <Title title={collection.name} subTitle="Collection" />
      <Divider sx={{ mb: 2 }} />
      <MetadataView
        data={collection.metadata ?? {}}
        schema={schema.schema}
        exclude={personalDataPaths(schema.schema)}
      />
    </>
  );
};

const CollectionLandingPage = ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => (
  <Box
    sx={{
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      p: 2,
      bgcolor: "background.default",
    }}
  >
    <Suspense fallback={<SkeletonFull sx={{ minHeight: 400 }} />}>
      <CollectionLanding params={params} />
    </Suspense>
  </Box>
);

export default CollectionLandingPage;
