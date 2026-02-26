import { useEffect, useMemo } from "react";
import { useCloseGuard } from "@/providers/CloseGuardProvider";
import { useConfirm } from "@/hooks/useConfirm";

type Options = {
  enabled: boolean;
  entityName: string;
  onSave: () => Promise<void> | void;
  saveText?: string;
  cancelText?: string;
};

export function useSaveChanges({
  enabled,
  entityName,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
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
      const shouldSave = await confirm({
        title: "Unsaved changes",
        description: message,
        confirmText: saveText,
        cancelText,
        confirmColor: "primary",
      });

      if (!shouldSave) {
        return false;
      }

      await onSave();
      return true;
    });

    return () => registerCloseGuard(null);
  }, [
    enabled,
    message,
    saveText,
    cancelText,
    onSave,
    confirm,
    registerCloseGuard,
  ]);
}
