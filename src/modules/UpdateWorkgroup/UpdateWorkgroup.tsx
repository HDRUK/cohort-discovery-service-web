"use client";
import UpdatePanel from "@/components/UpdatePanel";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useCallback, useEffect } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import useAdminStore from "@/hooks/useAdminStore";
import { TAG_CUSTODIAN_COLLECTION, TAG_WORKGROUP_ADMIN } from "@/config/tags";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useSaveChanges } from "@/hooks/useSaveChanges";

const UpdateWorkgroup = () => {
  const { expandedRight, toggleRight: onClose } = useThreePane();

  const addCollectionsToWorkgroup = useAdminStore(
    (s) => s.addCollectionsToWorkgroup,
  );

  const addUsersToWorkgroup = useAdminStore((s) => s.addUsersToWorkgroup);

  const collections = useAdminStore((s) => s.allAprovedCollections);
  const users = useAdminStore((s) => s.users);

  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);

  const notify = useNotify();

  const formMethods = useForm<UpdateWorkgroupFormValues>({
    defaultValues: {
      collections: [],
      users: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { defaultValues },
  } = formMethods;

  useEffect(() => {
    if (!selectedWorkgroup) return;

    const newValues = {
      collections: [],
      users: [],
    };

    reset(newValues, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [selectedWorkgroup, reset]);

  const submitForm = useCallback(
    async (data: UpdateWorkgroupFormValues, closeAfter = false) => {
      if (!selectedWorkgroup?.id) return;

      const { id } = selectedWorkgroup;

      if (data.users.length > 0) {
        await addUsersToWorkgroup({
          ids: data.users.map((c) => +c.value),
          workgroup_id: id,
        });
        notify.success(`Updated workgroup users ${selectedWorkgroup?.name}`);

        revalidateAction(TAG_CUSTODIAN_COLLECTION);
        revalidateAction(TAG_WORKGROUP_ADMIN);
      }

      if (data.collections.length > 0) {
        await addCollectionsToWorkgroup({
          ids: data.collections.map((c) => +c.value),
          workgroup_id: id,
        });
        notify.success(
          `Updated workgroup collections ${selectedWorkgroup?.name}`,
        );

        revalidateAction(TAG_CUSTODIAN_COLLECTION);
        revalidateAction(TAG_WORKGROUP_ADMIN);
      }

      reset();
      if (closeAfter) {
        onClose?.();
      }
    },
    [
      notify,
      selectedWorkgroup,
      addCollectionsToWorkgroup,
      addUsersToWorkgroup,
      onClose,
      reset,
    ],
  );

  const onSave = (closeAfter = false) =>
    handleSubmit((values) => submitForm(values, closeAfter))();

  const onDiscard = useCallback(() => {
    reset(defaultValues);
    onClose();
  }, [reset, onClose, defaultValues]);

  const handleUnlockClick = () => {
    onClose?.();
  };

  useSaveChanges<UpdateWorkgroupFormValues>({
    control,
    entityName: selectedWorkgroup?.name ?? "",
    onSave,
    onDiscard,
  });

  return (
    <FormProvider {...formMethods}>
      <UpdatePanel
        label="Workgroup"
        expandedRight={expandedRight}
        onLockClick={() => onSave(true)}
        onUnlockClick={handleUnlockClick}
      >
        <ActionMenuSection
          title={"Add Collections"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <Controller
            name="collections"
            disabled={!expandedRight}
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormMultiSelect
                  {...field}
                  placeholder="Search and add approved collections..."
                  disabled={!expandedRight}
                  multiple
                  options={collections.map((c) => ({
                    label: c.name,
                    value: c.id as ValueType,
                  }))}
                  getChipLabel={(options, value) =>
                    options.find((option) => option.value === value.value)
                      ?.label || ""
                  }
                  tagsBelow
                  error={error}
                  sx={{ pt: 1 }}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              );
            }}
          />
        </ActionMenuSection>
        <ActionMenuSection
          title={"Add Users"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <Controller
            name="users"
            disabled={!expandedRight}
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormMultiSelect
                  {...field}
                  placeholder="Search and add users..."
                  disabled={!expandedRight}
                  multiple
                  options={users.map((c) => ({
                    label: `${c.name} (${c.email})`,
                    value: c.id as ValueType,
                  }))}
                  getChipLabel={(options, value) =>
                    options.find((option) => option.value === value.value)
                      ?.label || ""
                  }
                  tagsBelow
                  error={error}
                  sx={{ pt: 1 }}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              );
            }}
          />
        </ActionMenuSection>
      </UpdatePanel>
    </FormProvider>
  );
};

export default UpdateWorkgroup;
