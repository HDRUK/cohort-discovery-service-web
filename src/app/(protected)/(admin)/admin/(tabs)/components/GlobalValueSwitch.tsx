import { useOptimistic, useTransition } from "react";
import { Box, CircularProgress, Switch } from "@mui/material";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";
import { useNotify } from "@/providers/NotifyProvider";

interface GlobalValueSwitchProps {
  feature: string;
  global: boolean;
}

const GlobalValueSwitch = ({ feature, global }: GlobalValueSwitchProps) => {
  const [shown, setShown] = useOptimistic(global);
  const [isSaving, startSaving] = useTransition();
  const notify = useNotify();

  const save = (enabled: boolean) =>
    startSaving(async () => {
      setShown(enabled);
      try {
        await updateFeatureFlag(feature, { enabled });
      } catch {
        notify.error(
          `Could not save the "${feature}" flag, so it has been switched back. Try again, or refresh the page if it keeps failing.`,
        );
      }
    });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Switch
        checked={shown}
        disabled={isSaving}
        slotProps={{ input: { "aria-label": `${feature} global value` } }}
        onChange={(event) => save(event.target.checked)}
      />
      <CircularProgress
        size={16}
        sx={{ visibility: isSaving ? "visible" : "hidden" }}
      />
    </Box>
  );
};

export default GlobalValueSwitch;
