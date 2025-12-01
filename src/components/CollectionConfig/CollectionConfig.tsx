import { Box, Stack, MenuItem, Chip, Typography } from "@mui/material";

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form";
import FormTextField from "@/components/FormTextField";
import { capitaliseFirstLetter, getEnumLabel } from "@/utils/string";
import { FrequencyMode, frequencyMap } from "@/types/api";
import FormRadioGroup from "@/components/FormRadioGroup";
import { useEffect, useMemo, useState } from "react";
import HourMinuteSelect from "../HourMinuteSelect";

interface BaseCollectionConfigProps {
  disabled?: boolean;
  keepExpanded?: boolean;
  hideSynchronisationTime?: boolean;
}

interface CollectionConfigProps<TFormValues extends FieldValues>
  extends BaseCollectionConfigProps {
  frequencyFieldName: Path<TFormValues>;
  runTimeFrequencyFieldName: Path<TFormValues>;
  runTimeHourFieldName: Path<TFormValues>;
  runTimeMinuteFieldName: Path<TFormValues>;
}

const CollectionConfig = <TFormValues extends FieldValues>({
  disabled = false,
  keepExpanded = false,
  hideSynchronisationTime = true,
  frequencyFieldName,
  runTimeFrequencyFieldName,
  runTimeHourFieldName,
  runTimeMinuteFieldName,
}: CollectionConfigProps<TFormValues>) => {
  const { control, setValue } = useFormContext<TFormValues>();

  const [frequencyExpanded, setFrequencyExpanded] = useState(
    keepExpanded ? true : false
  );

  const {
    field: { value: frequencyField },
  } = useController<TFormValues>({
    name: frequencyFieldName,
    control,
  });

  const {
    field: { value: runTime },
  } = useController<TFormValues>({
    name: runTimeFrequencyFieldName,
    control,
  });

  const options = useMemo(() => {
    const arr = frequencyMap[frequencyField] ?? [];
    return [...Array(arr.length).keys()];
  }, [frequencyField]);

  const frequencyLabels = useMemo(
    () => frequencyMap[frequencyField] ?? [],
    [frequencyField]
  );

  useEffect(() => {
    setValue(
      runTimeFrequencyFieldName,
      0 as PathValue<TFormValues, typeof runTimeFrequencyFieldName>
    );
  }, [runTimeFrequencyFieldName, frequencyField, setValue]);

  return (
    <Stack spacing={2} width={300} height={"100%"}>
      <Typography> Configuration Frequency</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Chip
          onClick={
            keepExpanded
              ? undefined
              : () => setFrequencyExpanded((prev) => !prev)
          }
          color="secondary"
          label={getEnumLabel(FrequencyMode, frequencyField)}
        />
        <Chip
          color="secondary"
          variant="outlined"
          label={frequencyLabels[runTime]}
        />
      </Box>
      {frequencyExpanded && !disabled && (
        <>
          <Controller
            name={frequencyFieldName}
            control={control}
            rules={{ required: "Frequency Mode is required" }}
            render={({ field, fieldState }) => (
              <FormRadioGroup
                {...field}
                label="Frequency"
                error={!!fieldState.error}
                required
                options={Object.entries(FrequencyMode).map(([key, value]) => ({
                  value,
                  label: capitaliseFirstLetter(key.toLowerCase()),
                }))}
              />
            )}
          />

          <Controller
            name={runTimeFrequencyFieldName}
            control={control}
            rules={{ required: "Run time frequency is required" }}
            render={({ field, fieldState: { error } }) => (
              <FormTextField {...field} error={error} select fullWidth required>
                {options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {frequencyLabels[opt]}
                  </MenuItem>
                ))}
              </FormTextField>
            )}
          />
        </>
      )}

      {!hideSynchronisationTime && (
        <Typography> Synchronisation Time</Typography>
      )}
      <HourMinuteSelect<TFormValues>
        hourValueName={runTimeHourFieldName}
        minuteValueName={runTimeMinuteFieldName}
        control={control}
        hidden={hideSynchronisationTime}
      />
    </Stack>
  );
};

export default CollectionConfig;
