import { Stack } from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { UpdateNetworkFormValues } from "@/types/forms";
import FormTextField from "@/components/FormTextField";
import { useNotify } from "@/providers/NotifyProvider";

import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import useAdminStore from "@/hooks/useAdminStore";
import useUserStore from "@/hooks/useUserStore";
import { useEffect } from "react";
import UpdatePanel from "@/components/UpdatePanel";

export interface UpdateNetworkProps {
  expandedRight: boolean;
  onClose?: () => void;
}

const UpdateNetwork = ({ expandedRight, onClose }: UpdateNetworkProps) => {
  const updateNetwork = useAdminStore((s) => s.updateNetwork);
  const networks = useAdminStore((s) => s.networks);
  const custodians = useUserStore((s) => s.custodians);
  const addCustodiansToNetwork = useAdminStore((s) => s.addCustodiansToNetwork);
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);

  const notify = useNotify();

  const formMethods = useForm<UpdateNetworkFormValues>({
    defaultValues: {
      name: "",
      url: "",
      custodians: [],
    },
  });

  const { handleSubmit, control, reset } = formMethods;

  useEffect(() => {
    if (!selectedNetwork) return;

    const newValues = {
      name: selectedNetwork.name,
      url: selectedNetwork.url ?? "",
      custodians: selectedNetwork.custodians.map((c) => ({
        label: c.name,
        value: c.id,
      })),
    };

    reset(newValues, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [selectedNetwork, reset]);

  const submitForm = async (data: UpdateNetworkFormValues) => {
    if (!selectedNetwork) return;
    await updateNetwork(selectedNetwork.id, {
      name: data.name,
      url: data.url,
    });

    if (data.custodians.length > 0) {
      await addCustodiansToNetwork({
        custodian_ids: data.custodians.map((c) => +c.value),
        id: selectedNetwork.id,
      });
    }

    notify.success(`Updated network ${data.name}`);
    onClose?.();
  };

  return (
    <UpdatePanel
      label="Network"
      expandedRight={expandedRight}
      onLockClick={handleSubmit((v) => submitForm(v))}
      onUnlockClick={() => onClose?.()}
    >
      <FormProvider {...formMethods}>
        <Stack spacing={2} width={"70%"} height={"100%"} sx={{ py: 1 }}>
          <Controller
            name="name"
            control={control}
            disabled={!expandedRight}
            rules={{
              required: "A network name is required",
              validate: (value) => {
                const v = value?.trim().toLowerCase();
                if (!v) return true;

                const current = (selectedNetwork?.name ?? "")
                  .trim()
                  .toLowerCase();
                if (current && v === current) return true; // allow unchanged name

                const exists = (networks ?? []).some(
                  (n) => (n.name ?? "").trim().toLowerCase() === v,
                );

                return exists
                  ? "A network with this name already exists"
                  : true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <FormTextField
                {...field}
                label="Network name"
                error={error}
                fullWidth
                required
                sx={{ pt: 1 }}
              />
            )}
          />

          <Controller
            name="url"
            control={control}
            disabled={!expandedRight}
            render={({ field, fieldState: { error } }) => (
              <FormTextField
                {...field}
                label="Network url"
                error={error}
                fullWidth
                required={false}
                sx={{ pt: 1 }}
              />
            )}
          />

          <Controller
            name="custodians"
            disabled={!expandedRight}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormMultiSelect
                {...field}
                label={"Select custodians"}
                placeholder="Search custodians..."
                multiple
                options={
                  custodians?.map((c) => ({
                    label: c.name,
                    value: c.id as ValueType,
                  })) || []
                }
                getChipLabel={(options, value) =>
                  options.find((option) => option.value === value.value)
                    ?.label || ""
                }
                tagsBelow
                error={error}
                sx={{ pt: 1 }}
              />
            )}
          />
        </Stack>
      </FormProvider>
    </UpdatePanel>
  );
};

export default UpdateNetwork;
