import { Box, Chip, FormControlLabel, FormLabel, Stack } from "@mui/material";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import SquareRadio from "../SquareRadio";

const ToggleVertical = <T extends FieldValues>({
  name,
  labelTrue,
  labelFalse,
  label,
  disabled = false,
}: {
  name: Path<T>;
  labelTrue: string;
  labelFalse: string;
  label?: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext<T>();

  return (
    <Box>
      {label && <FormLabel> {label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Box>
              <Chip
                label={field.value ? labelTrue : labelFalse}
                color="secondary"
              />
            </Box>
            {!disabled && (
              <Stack>
                <FormControlLabel
                  label={labelTrue}
                  control={
                    <SquareRadio
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                />
                <FormControlLabel
                  label={labelFalse}
                  control={
                    <SquareRadio
                      checked={!field.value}
                      onChange={(e) => field.onChange(!e.target.checked)}
                    />
                  }
                />
              </Stack>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default ToggleVertical;
