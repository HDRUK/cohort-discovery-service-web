"use client";
import { Typography, IconButton } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Collection, Workgroup } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useEffect } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormMultiSelect from "@/components/FormMultiSelect";
import addCollectionToWorkgroup from "@/actions/addCollectionToWorkgroup";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
export type UpdateWorkgroupProps = {
  selectedWorkgroup: Workgroup;
  collections: Collection[];
  expandedRight: boolean;
  onClose?: () => void;
};

const UpdateWorkgroup = ({
  selectedWorkgroup,
  collections,
  expandedRight,
  onClose,
}: UpdateWorkgroupProps) => {
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
    closeAfter = false
  ) => {
    if (!selectedWorkgroup?.id) return;

    const { id } = selectedWorkgroup;

    if (data.collections.length > 0) {
      data.collections.map(async (collection) => {
        await addCollectionToWorkgroup({
          id: +collection.value,
          workgroup_id: id,
        });
        notify.success(`Updated workgroup ${selectedWorkgroup?.name}`);

        revalidateAction(`collections-admin`);
        revalidateAction(`workgroups-admin`);
      });
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
      <Typography
        component="div"
        variant="overline"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        Workgroup
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
    </FormProvider>
  );
};

export default UpdateWorkgroup;
