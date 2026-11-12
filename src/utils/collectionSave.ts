import {
  CollectionSaveResult,
  CollectionSaveStep,
  SaveStepCollection,
} from "@/types/api";

const STEP_LABELS: Record<CollectionSaveStep, string> = {
  details: "the collection details",
  workgroups: "the workgroup changes",
  status: "the status change",
};

const pluraliseWorkgroups = (count: number) =>
  `${count} workgroup${count === 1 ? "" : "s"}`;

const nameCollection = ({ id, name }: SaveStepCollection) =>
  name ? `"${name}"` : `collection ${id}`;

export const describeCollectionSave = (
  subject: string,
  result: CollectionSaveResult,
  statusLabel?: string,
): { ok: boolean; message: string } => {
  if (!result.ok && result.failedCollection) {
    return {
      ok: false,
      message: `Couldn't save ${STEP_LABELS[result.failedStep]} for ${nameCollection(result.failedCollection)}: ${result.message}. Collections before it in the list were updated and the ones after it weren't, so check them and save again.`,
    };
  }

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
