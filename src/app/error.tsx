"use client";

import ErrorPanel from "@/components/ErrorPanel";

const RootError = ({ error, retry }: { error: unknown; retry: () => void }) => (
  <ErrorPanel error={error} onRetry={retry} />
);

export default RootError;
