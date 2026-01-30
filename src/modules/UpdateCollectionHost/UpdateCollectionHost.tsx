"use client";
import { Typography, Stack, Box } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CopyableVariable from "@/components/CopyableVariable";
import { CollectionHost } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNotify } from "@/providers/NotifyProvider";
import FormTextField from "@/components/FormTextField";
import FormLabel from "@/components/FormLabel";
import ActionMenuSection from "@/components/ActionMenuSection";
import ErrorHeader from "@/components/ErrorHeader";
import useCustodianStore from "@/store/useCustodianStore";

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
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (selectedCollectionHost)
      setValue("hostName", selectedCollectionHost.name);
  }, [selectedCollectionHost, setValue]);

  const submitHostForm = async (
    { hostName }: CollectionHostFormValues,
    closeAfter = false,
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
    submitHostForm(values, true),
  );
  const handleUnlockClick = () => {
    onClose?.();
  };

  return (
    <FormProvider {...formMethods}>
      <ActionMenuSection
        title={
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography component="span" variant="overline">
                Host
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                  borderRadius: 1,
                  p: 0.5,
                  "&:hover": {
                    bgcolor: "grey.300",
                  },
                }}
                onClick={() => {
                  if (expandedRight) {
                    handleLockClick();
                  } else {
                    handleUnlockClick();
                  }
                }}
              >
                {expandedRight ? <LockOpenIcon /> : <LockOutlineIcon />}
              </Box>
            </Box>
            <ErrorHeader errors={errors} depth={1} editing />
          </>
        }
        fixedExpanded
        scrollable
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
          <FormLabel underlined> Host Credentials</FormLabel>
          Client ID
          <CopyableVariable value={selectedCollectionHost.client_id} />
          Client Secret
          <CopyableVariable
            hidden
            value={selectedCollectionHost.client_secret}
          />
        </Stack>
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateCollectionHost;
