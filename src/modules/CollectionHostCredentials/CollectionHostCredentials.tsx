"use client";
import { Skeleton, Typography } from "@mui/material";
import CopyableVariable from "@/components/CopyableVariable";
import useCollectionHostCredentials from "./useCollectionHostCredentials";

export interface CollectionHostCredentialsProps {
  hostId: number;
}

const CollectionHostCredentials = ({
  hostId,
}: CollectionHostCredentialsProps) => {
  const { data, isPending, isError } = useCollectionHostCredentials(hostId);

  if (isPending) {
    return <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />;
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mb: 2 }}>
        We couldn&apos;t load this host&apos;s credentials. Refresh the page to
        try again, or ask an admin if you no longer have access to the host.
      </Typography>
    );
  }

  return (
    <>
      Client ID
      <CopyableVariable value={data.client_id} sx={{ mb: 2 }} />
      Client Secret
      <CopyableVariable hidden value={data.client_secret} sx={{ mb: 2 }} />
    </>
  );
};

export default CollectionHostCredentials;
