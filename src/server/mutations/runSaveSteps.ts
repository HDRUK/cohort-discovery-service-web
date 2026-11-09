import "server-only";

import { unstable_rethrow } from "next/navigation";
import { ApiError } from "@/lib/https";
import { CollectionSaveResult, CollectionSaveStep } from "@/types/api";

export const runSaveSteps = async (
  steps: [CollectionSaveStep, () => Promise<void>][],
): Promise<Extract<CollectionSaveResult, { ok: false }> | null> => {
  for (const [step, run] of steps) {
    try {
      await run();
    } catch (error) {
      unstable_rethrow(error);
      return {
        ok: false,
        failedStep: step,
        message: error instanceof ApiError ? error.message : "Unexpected error",
      };
    }
  }
  return null;
};
