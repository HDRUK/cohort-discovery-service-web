import { CollectionSaveResult, CollectionSaveStep } from "@/types/api";

const STEP_LABELS: Record<CollectionSaveStep, string> = {
  details: "the collection details",
  workgroups: "the workgroup changes",
  status: "the status change",
};

const pluraliseWorkgroups = (count: number) =>
  `${count} workgroup${count === 1 ? "" : "s"}`;

export const describeCollectionSave = (
  subject: string,
  result: CollectionSaveResult,
  statusLabel?: string,
): { ok: boolean; message: string } => {
  if (!result.ok) {
    return {
      ok: false,
      message: `Couldn't save ${STEP_LABELS[result.failedStep]} for ${subject}: ${result.message}. Anything before that step was saved, so check it and try again.`,
    };
  }

  const changes = [
    ...(result.workgroupsAdded > 0
      ? [`added to ${pluraliseWorkgroups(result.workgroupsAdded)}`]
      : []),
    ...(result.workgroupsRemoved > 0
      ? [`removed from ${pluraliseWorkgroups(result.workgroupsRemoved)}`]
      : []),
    ...(result.statusChanged && statusLabel
      ? [`status changed to ${statusLabel}`]
      : []),
  ];

  return {
    ok: true,
    message: `Saved ${subject}${changes.length > 0 ? `: ${changes.join(", ")}` : ""}`,
  };
};
