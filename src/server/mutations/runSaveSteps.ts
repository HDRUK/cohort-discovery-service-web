import "server-only";

import { unstable_rethrow } from "next/navigation";
import { ApiError } from "@/lib/https";
import {
  CollectionSaveResult,
  CollectionSaveStep,
  SaveStepCollection,
} from "@/types/api";

export type SaveStep = [
  CollectionSaveStep,
  () => Promise<void>,
  SaveStepCollection?,
];

export const runSaveSteps = async (
  steps: SaveStep[],
): Promise<Extract<CollectionSaveResult, { ok: false }> | null> => {
  for (const [step, run, collection] of steps) {
    try {
      await run();
    } catch (error) {
      unstable_rethrow(error);
      return {
        ok: false,
        failedStep: step,
        ...(collection && { failedCollection: collection }),
        message: error instanceof ApiError ? error.message : "Unexpected error",
      };
    }
  }
  return null;
};
