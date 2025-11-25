import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { Control, FieldValues, Path, useController } from "react-hook-form";

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

interface HourMinuteSelectProps<TFieldValues extends FieldValues> {
  hourValueName: Path<TFieldValues>;
  minuteValueName: Path<TFieldValues>;
  control: Control<TFieldValues>;
  hidden?: boolean;
}

const HourMinuteSelect = <TFieldValues extends FieldValues>({
  hourValueName,
  minuteValueName,
  control,
  hidden = false,
}: HourMinuteSelectProps<TFieldValues>) => {
  const {
    field: { value: hourValue, onChange: handleHourChange },
  } = useController({ name: hourValueName, control });

  const {
    field: { value: minuteValue, onChange: handleMinuteChange },
  } = useController({ name: minuteValueName, control });

  if (hidden) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>UTC</Box>

      <FormControl>
        <InputLabel id="hour-label">Hour</InputLabel>
        <Select
          labelId="hour-label"
          label="Hour"
          value={hourValue}
          onChange={handleHourChange}
          sx={{ borderRadius: 0, maxWidth: 80 }}
        >
          {hours.map((h) => (
            <MenuItem key={h} value={h}>
              {h.toString().padStart(2, "0")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="minute-label">Minute</InputLabel>
        <Select
          labelId="minute-label"
          label="Minute"
          value={minuteValue}
          onChange={handleMinuteChange}
          sx={{ borderRadius: 0, maxWidth: 80 }}
        >
          {minutes.map((m) => (
            <MenuItem key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default HourMinuteSelect;
