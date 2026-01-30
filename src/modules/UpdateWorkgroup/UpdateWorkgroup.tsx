"use client";
import { Typography, Box } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Collection } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useEffect } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import useAdminStore from "@/hooks/useAdminStore";
import { TAG_CUSTODIAN_COLLECTION, TAG_WORKGROUP_ADMIN } from "@/config/tags";
export type UpdateWorkgroupProps = {
  collections: Collection[];
  expandedRight: boolean;
  onClose?: () => void;
};

const UpdateWorkgroup = ({
  collections,
  expandedRight,
  onClose,
}: UpdateWorkgroupProps) => {
  const addCollectionsToWorkgroup = useAdminStore(
    (s) => s.addCollectionsToWorkgroup,
  );
  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);

  const notify = useNotify();

  const formMethods = useForm<UpdateWorkgroupFormValues>({
    defaultValues: {
      collections: [],
    },
  });

  const { control, handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (!selectedWorkgroup) return;

    const newValues = {
      collections: [],
    };

    reset(newValues, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [selectedWorkgroup, reset]);

  const submitForm = async (
    data: UpdateWorkgroupFormValues,
    closeAfter = false,
  ) => {
    if (!selectedWorkgroup?.id) return;

    const { id } = selectedWorkgroup;

    if (data.collections.length > 0) {
      await addCollectionsToWorkgroup({
        ids: data.collections.map((c) => +c.value),
        workgroup_id: id,
      });
      notify.success(`Updated workgroup ${selectedWorkgroup?.name}`);

      revalidateAction(TAG_CUSTODIAN_COLLECTION);
      revalidateAction(TAG_WORKGROUP_ADMIN);
    }

    reset();
    if (closeAfter) {
      onClose?.();
    }
  };

  const handleLockClick = handleSubmit((values) => submitForm(values, true));
  const handleUnlockClick = () => {
    onClose?.();
  };

  return (
    <FormProvider {...formMethods}>
      <ActionMenuSection
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography component="span" variant="overline">
              Workgroup
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
        }
        fixedExpanded
        scrollable
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
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateWorkgroup;
