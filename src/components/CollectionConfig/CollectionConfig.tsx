import { Box, Stack, MenuItem, Chip, Typography } from "@mui/material";

import {
  Controller,
  Control,
  useController,
  UseFormSetValue,
} from "react-hook-form";
import { CreateCollectionFormValues } from "@/types/forms";
import FormTextField from "@/components/FormTextField";
import { capitaliseFirstLetter, getEnumLabel } from "@/utils/string";
import { FrequencyMode, frequencyMap } from "@/types/api";
import FormRadioGroup from "@/components/FormRadioGroup";
import { useEffect, useMemo, useState } from "react";
import HourMinuteSelect from "../HourMinuteSelect";

interface CollectionConfigProps {
  control: Control<CreateCollectionFormValues>;
  setValue: UseFormSetValue<CreateCollectionFormValues>;
  keepExpanded?: boolean;
  hideSynchronisationTime?: boolean;
}

const CollectionConfig = ({
  control,
  setValue,
  keepExpanded = false,
  hideSynchronisationTime = true,
}: CollectionConfigProps) => {
  const [frequencyExpanded, setFrequencyExpanded] = useState(
    keepExpanded ? true : false
  );

  const {
    field: { value: frequencyField },
  } = useController({
    name: "config.frequency_mode",
    control,
  });

  const {
    field: { value: runTime },
  } = useController({
    name: "config.run_time_frequency",
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
    setValue("config.run_time_frequency", 0);
  }, [frequencyField, setValue]);

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
      {frequencyExpanded && (
        <>
          <Controller
            name="config.frequency_mode"
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
            name="config.run_time_frequency"
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
      <HourMinuteSelect<CreateCollectionFormValues>
        hourValueName={"config.run_time_hour"}
        minuteValueName="config.run_time_minute"
        control={control}
        hidden={hideSynchronisationTime}
      />
    </Stack>
  );
};

export default CollectionConfig;
