export const errorReference = (error: unknown): string | undefined =>
  error instanceof Error &&
  "digest" in error &&
  typeof error.digest === "string"
    ? error.digest
    : undefined;
