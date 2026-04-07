import { useEffect, useMemo } from "react";
import { useCloseGuard } from "@/providers/CloseGuardProvider";
import { useConfirm } from "@/hooks/useConfirm";
import { Control, FieldValues } from "react-hook-form";
import { Ignore, useChangedFieldValues } from "./useChangedFieldValues";
import { Typography } from "@mui/material";
import ChangesTable from "@/components/ChangesTable";
import { MRT_TableInstance } from "material-react-table";
import { ChangeRow } from "@/components/ChangesTable/ChangesTable";

type FieldConfig = {
  label?: string;
  getValueLabel?: (
    value: unknown,
    id?: keyof ChangeRow,
    table?: MRT_TableInstance<ChangeRow>,
  ) => string | undefined;
};

export type FieldConfigMap = Record<string, FieldConfig>;

type Options<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  entityName: string;
  onSave: () => Promise<void> | void;
  onDiscard?: () => Promise<void> | void;
  saveText?: string;
  cancelText?: string;
  discardText?: string;
  showChanges?: boolean;
  ignoreFields?: Ignore;
  fieldConfig?: FieldConfigMap;
};

export function useSaveChanges<TFieldValues extends FieldValues>({
  control,
  entityName,
  onSave,
  onDiscard,
  saveText = "Save",
  cancelText = "Cancel",
  discardText = "Discard",
  showChanges = true,
  ignoreFields,
  fieldConfig,
}: Options<TFieldValues>) {
  const { registerCloseGuard } = useCloseGuard();
  const confirm = useConfirm();

  const { changed, hasChanges } = useChangedFieldValues<TFieldValues>({
    control,
    ignoreFields,
  });

  const message = useMemo(
    () => `Do you want to save your changes to "${entityName}"?`,
    [entityName],
  );

  useEffect(() => {
    if (!hasChanges) {
      registerCloseGuard(null);
      return;
    }

    registerCloseGuard(async () => {
      const result = await confirm({
        title: "Unsaved changes",
        description: (
          <>
            <Typography>{message}</Typography>
            {showChanges && (
              <ChangesTable changed={changed} fieldConfig={fieldConfig} />
            )}
          </>
        ),
        confirmText: saveText,
        tertiaryText: discardText,
        cancelText,
        confirmColor: "primary",
        maxWidth: "md",
      });

      if (result === "confirm") {
        await onSave();
        return true;
      } else if (result === "tertiary") {
        await onDiscard?.();
        return false;
      }
      return false;
    });

    return () => registerCloseGuard(null);
  }, [
    changed,
    fieldConfig,
    showChanges,
    hasChanges,
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
