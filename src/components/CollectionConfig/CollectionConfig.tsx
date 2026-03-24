import { Box, Stack, MenuItem, Chip, Typography } from "@mui/material";
import { Controller, useController, useFormContext } from "react-hook-form";
import FormTextField from "@/components/FormTextField";
import { capitaliseFirstLetter, getEnumLabel } from "@/utils/string";
import { FrequencyMode, frequencyMap } from "@/types/api";
import FormRadioGroup from "@/components/FormRadioGroup";
import { useEffect, useMemo, useState } from "react";
import HourMinuteSelect from "../HourMinuteSelect";
import FormLabel from "../FormLabel";
import { UpdateCollectionFormValues } from "@/types/forms";

interface CollectionConfigProps {
  disabled?: boolean;
  keepExpanded?: boolean;
  hideSynchronisationTime?: boolean;
}

const CollectionConfig = ({
  disabled = false,
  keepExpanded = false,
  hideSynchronisationTime = true,
}: CollectionConfigProps) => {
  const { control, setValue } = useFormContext<UpdateCollectionFormValues>();

  const [frequencyExpanded, setFrequencyExpanded] = useState(keepExpanded);

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

  const frequencyLabels = useMemo(() => {
    const key = String(frequencyField) as FrequencyMode;
    return frequencyMap[key] ?? [];
  }, [frequencyField]);

  const options = useMemo(() => {
    return frequencyLabels.map((_, index) => index);
  }, [frequencyLabels]);

  useEffect(() => {
    if (runTime == null || !options.includes(runTime)) {
      setValue("config.run_time_frequency", 0);
    }
  }, [options, runTime, setValue]);

  return (
    <Stack>
      <FormLabel underlined>Configuration Frequency</FormLabel>

      <Stack spacing={1} width={300} height="100%">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Chip
            onClick={
              keepExpanded
                ? undefined
                : () => setFrequencyExpanded((prev) => !prev)
            }
            color="secondary"
            label={getEnumLabel(FrequencyMode, String(frequencyField))}
          />
          <Chip
            color="secondary"
            variant="outlined"
            label={runTime != null ? (frequencyLabels[runTime] ?? "") : ""}
          />
        </Box>

        {frequencyExpanded && !disabled && (
          <>
            <Controller
              name="config.frequency_mode"
              control={control}
              rules={{ required: "Frequency Mode is required" }}
              render={({ field, fieldState }) => (
                <FormRadioGroup
                  {...field}
                  onChange={(_event, value) => field.onChange(Number(value))}
                  id={field.name}
                  label="Frequency"
                  error={!!fieldState.error}
                  required
                  options={Object.entries(FrequencyMode).map(
                    ([key, value]) => ({
                      value: Number(value),
                      label: capitaliseFirstLetter(key.toLowerCase()),
                    }),
                  )}
                />
              )}
            />

            <Controller
              name="config.run_time_frequency"
              control={control}
              rules={{ required: "Run time frequency is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  id={field.name}
                  error={error}
                  select
                  fullWidth
                  required
                >
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
          <Typography>Synchronisation Time</Typography>
        )}

        <HourMinuteSelect<UpdateCollectionFormValues>
          hourValueName="config.run_time_hour"
          minuteValueName="config.run_time_minute"
          control={control}
          hidden={hideSynchronisationTime}
        />
      </Stack>
    </Stack>
  );
};

export default CollectionConfig;
