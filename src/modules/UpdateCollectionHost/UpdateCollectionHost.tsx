"use client";
import { Typography, IconButton, Stack } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CopyableVariable from "@/components/CopyableVariable";
import { CollectionHost } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNotify } from "@/providers/NotifyProvider";
import { useDaphneStore } from "@/store/useDaphneStore";
import FormTextField from "@/components/FormTextField";
import FormLabel from "@/components/FormLabel";

type CollectionHostFormValues = { hostName: string };

export type UpdateCollectionHostProps = {
  selectedCollectionHost: CollectionHost;
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

const UpdateCollectionHost = ({
  selectedCollectionHost,
  expandedRight,
  onClose,
}: UpdateCollectionHostProps) => {
  const notify = useNotify();

  const {
    custodianData: { updateCollectionHost },
  } = useDaphneStore();

  const formMethods = useForm<CollectionHostFormValues>({
    defaultValues: {
      hostName: selectedCollectionHost?.name,
    },
  });

  const { handleSubmit, control, setValue } = formMethods;

  useEffect(() => {
    if (selectedCollectionHost)
      setValue("hostName", selectedCollectionHost.name);
  }, [selectedCollectionHost, setValue]);

  const submitHostForm = async (
    { hostName }: CollectionHostFormValues,
    closeAfter = false
  ) => {
    if (!selectedCollectionHost?.id) return;
    const { id } = selectedCollectionHost;

    if (hostName !== selectedCollectionHost.name) {
      await updateCollectionHost(id, { name: hostName });
      notify.success(`Updated host name ${hostName}`);
    }

    if (closeAfter) {
      onClose?.();
    }
  };

  const handleEnter = handleSubmit((values) => submitHostForm(values, false));
  const handleLockClick = handleSubmit((values) =>
    submitHostForm(values, true)
  );
  const handleUnlockClick = () => {
    onClose?.();
  };

  return (
    <FormProvider {...formMethods}>
      <Typography
        component="div"
        variant="overline"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        Host
        <IconButton
          size="small"
          sx={{ ml: "auto" }}
          onClick={() => {
            if (expandedRight) {
              handleLockClick();
            } else {
              handleUnlockClick();
            }
          }}
        >
          {expandedRight ? <LockOpenIcon /> : <LockOutlineIcon />}
        </IconButton>
      </Typography>

      <Controller
        name="hostName"
        control={control}
        disabled={!expandedRight}
        rules={{ required: "Host name is required" }}
        render={({ field, fieldState: { error } }) => (
          <FormTextField
            {...field}
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
        <FormLabel labelUnderlined> Host Credentials</FormLabel>
        Client ID
        <CopyableVariable value={selectedCollectionHost.client_id} />
        Client Secret
        <CopyableVariable hidden value={selectedCollectionHost.client_secret} />
      </Stack>
    </FormProvider>
  );
};

export default UpdateCollectionHost;
