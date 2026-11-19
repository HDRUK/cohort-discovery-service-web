"use client";
import UpdatePanel from "@/components/UpdatePanel";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useCallback, useEffect, useMemo } from "react";
import { Alert, Typography } from "@mui/material";
import updateWorkgroupMembers from "@/actions/workgroup/updateWorkgroupMembers";
import { useNotify } from "@/providers/NotifyProvider";
import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useSaveChanges } from "@/hooks/useSaveChanges";
import {
  useAdminAccessPolicy,
  useAdminCollections,
  useAdminUsers,
} from "@/contexts/AdminSectionContext";
import {
  describeMembershipFailures,
  firstLoginReplacementNotices,
  workgroupUserOptions,
} from "@/lib/membershipEditability";
import useSelectedWorkgroup from "@/hooks/useSelectedWorkgroup";
import useSelectedManagedUsers from "@/hooks/useSelectedManagedUsers";
import { Collection, User } from "@/types/api";

const NO_COLLECTIONS: Collection[] = [];
const NO_USERS: User[] = [];

const UpdateWorkgroup = () => {
  const { expandedRight, toggleRight: onClose } = useThreePane();

  const collections = useAdminCollections() ?? NO_COLLECTIONS;
  const users = useAdminUsers() ?? NO_USERS;
  const policy = useAdminAccessPolicy();

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

  const userOptions = useMemo(
    () => workgroupUserOptions(users, policy),
    [users, policy],
  );

  const { warning: managedWarning } = useSelectedManagedUsers();

  const selectedUsers = useWatch({ control, name: "users" });

  const firstLoginNotices = useMemo(
    () =>
      policy
        ? firstLoginReplacementNotices(
            users,
            policy,
            selectedUsers.map((option) => +option.value),
          )
        : [],
    [users, policy, selectedUsers],
  );

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
        const { failed, failedCollections = [] } = await updateWorkgroupMembers(
          id,
          { userIds, collectionIds },
        );

        if (failed.length || failedCollections.length) {
          notify.error(
            [
              describeMembershipFailures(failed, users),
              describeMembershipFailures(failedCollections, collections),
            ]
              .filter(Boolean)
              .join(" "),
          );
          reset(
            {
              users: data.users.filter((option) =>
                failed.some((failure) => failure.id === +option.value),
              ),
              collections: data.collections.filter((option) =>
                failedCollections.some(
                  (failure) => failure.id === +option.value,
                ),
              ),
            },
            { keepDefaultValues: true },
          );
          return;
        }

        notify.success(`Updated workgroup ${selectedWorkgroup.name}`);
      }

      reset();
      if (closeAfter) {
        onClose?.();
      }
    },
    [notify, selectedWorkgroup, onClose, reset, users, collections],
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
        {managedWarning && (
          <Alert severity="warning" sx={{ mx: 2, mb: 1 }}>
            {managedWarning}
          </Alert>
        )}
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
                  options={userOptions}
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
          {firstLoginNotices.map((notice) => (
            <Typography
              key={notice}
              variant="body2"
              color="text.secondary"
              sx={{ pt: 1 }}
            >
              {notice}
            </Typography>
          ))}
        </ActionMenuSection>
      </UpdatePanel>
    </FormProvider>
  );
};

export default UpdateWorkgroup;
