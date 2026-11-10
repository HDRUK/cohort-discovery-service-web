"use client";
import UpdatePanel from "@/components/UpdatePanel";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useCallback, useEffect } from "react";
import updateWorkgroupMembers from "@/actions/workgroup/updateWorkgroupMembers";
import { useNotify } from "@/providers/NotifyProvider";
import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useSaveChanges } from "@/hooks/useSaveChanges";
import {
  useAdminCollections,
  useAdminUsers,
} from "@/contexts/AdminSectionContext";
import useSelectedWorkgroup from "@/hooks/useSelectedWorkgroup";
import { Collection, User } from "@/types/api";

const NO_COLLECTIONS: Collection[] = [];
const NO_USERS: User[] = [];

const UpdateWorkgroup = () => {
  const { expandedRight, toggleRight: onClose } = useThreePane();

  const collections = useAdminCollections() ?? NO_COLLECTIONS;
  const users = useAdminUsers() ?? NO_USERS;

  const selectedWorkgroup = useSelectedWorkgroup();

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

      const userIds = data.users.map((c) => +c.value);
      const collectionIds = data.collections.map((c) => +c.value);

      if (userIds.length > 0 || collectionIds.length > 0) {
        await updateWorkgroupMembers(id, { userIds, collectionIds });
        notify.success(`Updated workgroup ${selectedWorkgroup.name}`);
      }

      reset();
      if (closeAfter) {
        onClose?.();
      }
    },
    [notify, selectedWorkgroup, onClose, reset],
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
