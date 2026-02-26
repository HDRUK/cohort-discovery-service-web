"use client";
import { Stack } from "@mui/material";
import CopyableVariable from "@/components/CopyableVariable";
import { CollectionHost } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNotify } from "@/providers/NotifyProvider";
import FormTextField from "@/components/FormTextField";
import FormLabel from "@/components/FormLabel";
import ErrorHeader from "@/components/ErrorHeader";
import useCustodianStore from "@/hooks/useCustodianStore";
import UpdatePanel from "@/components/UpdatePanel";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useSaveChanges } from "@/hooks/useSaveChanges";

type CollectionHostFormValues = { hostName: string };

export type UpdateCollectionHostProps = {
  selectedCollectionHost: CollectionHost;
};

const UpdateCollectionHost = ({
  selectedCollectionHost,
}: UpdateCollectionHostProps) => {
  const { expandedRight, toggleRight: onClose } = useThreePane();
  const notify = useNotify();
  const updateCollectionHost = useCustodianStore((s) => s.updateCollectionHost);

  const formMethods = useForm<CollectionHostFormValues>({
    defaultValues: {
      hostName: selectedCollectionHost?.name,
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = formMethods;

  useEffect(() => {
    if (selectedCollectionHost) {
      setValue("hostName", selectedCollectionHost.name, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [selectedCollectionHost, setValue]);

  const submitHostForm = async (
    { hostName }: CollectionHostFormValues,
    closeAfter = false,
  ) => {
    if (!selectedCollectionHost?.id) return;

    if (hostName !== selectedCollectionHost.name) {
      await updateCollectionHost(selectedCollectionHost.id, { name: hostName });
      notify.success(`Updated host name ${hostName}`);
    }

    if (closeAfter) onClose?.();
  };

  const handleEnter = () =>
    handleSubmit((values) => submitHostForm(values, false))();

  useSaveChanges({
    enabled: true, //isDirty,
    entityName: selectedCollectionHost.name,
    onSave: () => handleSubmit((v) => submitHostForm(v, true))(),
  });

  return (
    <FormProvider {...formMethods}>
      <UpdatePanel
        label="Host"
        expandedRight={expandedRight}
        onLockClick={() => handleSubmit((v) => submitHostForm(v, true))()}
        onUnlockClick={() => onClose?.()}
        rightExtras={<ErrorHeader errors={errors} depth={1} editing />}
      >
        <Controller
          name="hostName"
          control={control}
          disabled={!expandedRight}
          rules={{ required: "Host name is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              id={field.name}
              slotProps={{ input: { sx: { borderRadius: 0 } } }}
              error={error}
              helperText={error?.message}
              label="Host Name"
              labelUnderlined
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEnter();
                }
              }}
            />
          )}
        />

        <Stack sx={{ mt: 1 }}>
          <FormLabel underlined>Host Credentials</FormLabel>
          Client ID
          <CopyableVariable value={selectedCollectionHost.client_id} />
          Client Secret
          <CopyableVariable
            hidden
            value={selectedCollectionHost.client_secret}
          />
        </Stack>
      </UpdatePanel>
    </FormProvider>
  );
};

export default UpdateCollectionHost;
