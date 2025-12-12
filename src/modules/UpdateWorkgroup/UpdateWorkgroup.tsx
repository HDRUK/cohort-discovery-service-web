"use client";
import { Typography, IconButton, MenuItem } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Collection, Workgroup } from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { UpdateWorkgroupFormValues } from "@/types/forms";
import { useEffect } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormDropdown from "@/components/FormDropdown";
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
      collectionId: "",
    },
  });

  const { control, handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (!selectedWorkgroup) return;

    const newValues = {
      collectionId: "",
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

    if (data.collectionId) {
      await addCollectionToWorkgroup({
        id: +data.collectionId,
        workgroup_id: id,
      });
      notify.success(`Updated workgroup ${selectedWorkgroup?.name}`);

      revalidateAction(`collections-admin`);
      revalidateAction(`workgroups-admin`);
    }

    if (closeAfter) {
      onClose?.();
    }
  };

  const handleLockClick = handleSubmit((values) => submitForm(values, true));
  const handleUnlockClick = () => {
    onClose?.();
  };

  function renderVal(option) {
    return <Typography>{option.label}</Typography>;
  }
  function renderSelectedVal(option) {
    return <Typography>{option.label}</Typography>;
  }

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
          name="collectionId"
          disabled={!expandedRight}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormDropdown
              {...field}
              select
              renderMenuOption={renderVal}
              renderSelectedOption={renderSelectedVal}
              error={error}
              fullWidth
              placeHolderOption={
                <MenuItem value={0} disabled>
                  Add approved collections...
                </MenuItem>
              }
              options={collections.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              }))}
              chipColor="secondary"
            />
          )}
        />
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateWorkgroup;
