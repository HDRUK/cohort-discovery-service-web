import { useEffect, useMemo } from "react";
import { useCloseGuard } from "@/providers/CloseGuardProvider";
import { useConfirm } from "@/hooks/useConfirm";

type Options = {
  enabled: boolean;
  entityName: string;
  onSave: () => Promise<void> | void;
  onDiscard?: () => Promise<void> | void;
  saveText?: string;
  cancelText?: string;
  discardText?: string;
};

export function useSaveChanges({
  enabled,
  entityName,
  onSave,
  onDiscard,
  saveText = "Save",
  cancelText = "Cancel",
  discardText = "Discard",
}: Options) {
  const { registerCloseGuard } = useCloseGuard();
  const confirm = useConfirm();

  const message = useMemo(
    () => `Do you want to save your changes to ${entityName}`,
    [entityName],
  );

  useEffect(() => {
    if (!enabled) {
      registerCloseGuard(null);
      return;
    }

    registerCloseGuard(async () => {
      const result = await confirm({
        title: "Unsaved changes",
        description: message,
        confirmText: saveText,
        tertiaryText: discardText,
        cancelText,
        confirmColor: "primary",
      });

      if (result === "confirm") {
        await onSave();
        return true;
      } else if (result === "tertiary") {
        await onDiscard?.();
        return true;
      }
      return false;
    });

    return () => registerCloseGuard(null);
  }, [
    enabled,
    message,
    saveText,
    discardText,
    cancelText,
    onSave,
    onDiscard,
    confirm,
    registerCloseGuard,
  ]);
}
