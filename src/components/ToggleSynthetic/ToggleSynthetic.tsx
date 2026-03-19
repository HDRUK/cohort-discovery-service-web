import { UpdateCollectionFormValues } from "@/types/forms";
import { Box, Chip, FormControlLabel, FormLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import SquareRadio from "../SquareRadio";

const ToggleSynthetic = ({
  label,
  disabled = false,
}: {
  label?: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext<UpdateCollectionFormValues>();

  return (
    <>
      {label && <FormLabel> {label}</FormLabel>}
      <Controller
        name="collection.is_synthetic"
        control={control}
        render={({ field }) => (
          <>
            <Box>
              <Chip
                label={field.value ? "Synthetic" : "Non-synthetic"}
                color="secondary"
              />
            </Box>
            {!disabled && (
              <>
                <FormControlLabel
                  label="Synthetic"
                  control={
                    <SquareRadio
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                />
                <FormControlLabel
                  label="Non-synthetic"
                  control={
                    <SquareRadio
                      checked={!field.value}
                      onChange={(e) => field.onChange(!e.target.checked)}
                    />
                  }
                />
              </>
            )}
          </>
        )}
      />
    </>
  );
};

export default ToggleSynthetic;
