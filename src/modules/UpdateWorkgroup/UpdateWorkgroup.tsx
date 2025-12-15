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
export type UpdateCollectionProps = {
  selectedWorkgroup: Workgroup;
  collections: Collection[];
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

const UpdateWorkgroup = ({
  selectedWorkgroup,
  collections,
  expandedRight,
  onClose,
}: UpdateCollectionProps) => {
  const notify = useNotify();

  const formMethods = useForm<UpdateWorkgroupFormValues>({
    defaultValues: {
      collectionIds: [],
    },
  });

  const { control, handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (!selectedWorkgroup) return;

    const newValues = {
      collectionIds: [],
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

    if (data.collectionIds.length > 0) {
      console.log(data.collectionIds);
      data.collectionIds.map(async (collectionId) => {
        await addCollectionToWorkgroup({
          id: +collectionId,
          workgroup_id: id,
        });
        notify.success(`Updated workgroup ${selectedWorkgroup?.name}`);

        revalidateAction(`collections-admin`);
        revalidateAction(`workgroups-admin`);
      });
    }

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
          name="collectionIds"
          disabled={!expandedRight}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormMultiSelect
              field={field}
              placeholder="Add approved collections..."
              disabled={!expandedRight}
              multiple
              options={collections.map((c) => ({
                label: c.name,
                value: c.id.toString(),
                onClick: () => {},
              }))}
              getChipLabel={(options, value) =>
                options.find((option) => option.value.toString() === value)
                  ?.label || ""
              }
              tagsBelow
            />
          )}
        />
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateWorkgroup;
