"use client";

import { useMemo, useTransition } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import clearFeatureOverride from "@/actions/admin/clearFeatureOverride";
import setFeatureOverride from "@/actions/admin/setFeatureOverride";
import {
  useAdminFeatureOverrides,
  useAdminUsers,
  useAdminWorkgroups,
} from "@/contexts/AdminSectionContext";
import { useNotify } from "@/providers/NotifyProvider";
import {
  FeatureOverride,
  FeatureOverrides,
  FeatureOverrideSubject,
} from "@/types/features";

interface SubjectOption {
  id: number;
  label: string;
}

const SUBJECT_LABELS: Record<FeatureOverrideSubject, string> = {
  [FeatureOverrideSubject.Workgroup]: "Workgroups",
  [FeatureOverrideSubject.User]: "Users",
};

const ADD_LABELS: Record<FeatureOverrideSubject, string> = {
  [FeatureOverrideSubject.Workgroup]: "Add a workgroup",
  [FeatureOverrideSubject.User]: "Add a user",
};

const PRECEDENCE_HELP =
  "A user's own override wins. Otherwise the flag is on if any of their workgroups turns it on, off if their workgroups only turn it off, and the global value if there are no overrides.";

interface SubjectOverridesProps {
  feature: FeatureOverrides;
  subject: FeatureOverrideSubject;
  overrides: FeatureOverride[];
  options: SubjectOption[];
  pending: boolean;
  save: (change: () => Promise<void>) => void;
}

const SubjectOverrides = ({
  feature,
  subject,
  overrides,
  options,
  pending,
  save,
}: SubjectOverridesProps) => {
  const available = useMemo(() => {
    const overridden = new Set(overrides.map(({ id }) => id));
    return options.filter(({ id }) => !overridden.has(id));
  }, [overrides, options]);

  return (
    <Stack gap={1}>
      <Typography variant="subtitle2">{SUBJECT_LABELS[subject]}</Typography>
      {overrides.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No overrides
        </Typography>
      )}
      {overrides.map((override) => (
        <Stack
          key={override.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="body2">{override.name}</Typography>
            {override.email && (
              <Typography variant="caption" color="text.secondary">
                {override.email}
              </Typography>
            )}
          </Box>
          <Stack direction="row" alignItems="center">
            <Switch
              checked={override.enabled}
              disabled={pending}
              slotProps={{
                input: { "aria-label": `${override.name} override` },
              }}
              onChange={(event) =>
                save(() =>
                  setFeatureOverride(feature.feature, subject, override.id, {
                    enabled: event.target.checked,
                  }),
                )
              }
            />
            <Tooltip title="Clear override">
              <span>
                <IconButton
                  aria-label={`Clear override for ${override.name}`}
                  disabled={pending}
                  onClick={() =>
                    save(() =>
                      clearFeatureOverride(
                        feature.feature,
                        subject,
                        override.id,
                      ),
                    )
                  }
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      ))}
      <Autocomplete
        options={available}
        value={null}
        disabled={pending}
        blurOnSelect
        onChange={(_, option) => {
          if (!option) return;
          save(() =>
            setFeatureOverride(feature.feature, subject, option.id, {
              enabled: !feature.global,
            }),
          );
        }}
        renderInput={(params) => (
          <TextField {...params} size="small" label={ADD_LABELS[subject]} />
        )}
      />
    </Stack>
  );
};

interface FeatureOverridesCardProps {
  feature: FeatureOverrides;
  userOptions: SubjectOption[];
  workgroupOptions: SubjectOption[];
}

const FeatureOverridesCard = ({
  feature,
  userOptions,
  workgroupOptions,
}: FeatureOverridesCardProps) => {
  const [pending, startTransition] = useTransition();
  const notify = useNotify();

  const save = (change: () => Promise<void>) =>
    startTransition(async () => {
      try {
        await change();
      } catch {
        notify.error(
          `Could not save the override for "${feature.feature}". Try again, or refresh the page if it keeps failing.`,
        );
      }
    });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack gap={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">{feature.feature}</Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            {pending && <CircularProgress size={16} />}
            <Typography variant="body2" color="text.secondary">
              Global: {feature.global ? "on" : "off"}
            </Typography>
          </Stack>
        </Stack>
        <SubjectOverrides
          feature={feature}
          subject={FeatureOverrideSubject.Workgroup}
          overrides={feature.workgroups}
          options={workgroupOptions}
          pending={pending}
          save={save}
        />
        <SubjectOverrides
          feature={feature}
          subject={FeatureOverrideSubject.User}
          overrides={feature.users}
          options={userOptions}
          pending={pending}
          save={save}
        />
      </Stack>
    </Paper>
  );
};

export const FeatureOverridesManager = () => {
  const featureOverrides = useAdminFeatureOverrides();
  const users = useAdminUsers();
  const workgroups = useAdminWorkgroups();

  const userOptions = useMemo(
    () =>
      (users ?? []).map(({ id, name, email }) => ({
        id,
        label: `${name} (${email})`,
      })),
    [users],
  );
  const workgroupOptions = useMemo(
    () => (workgroups ?? []).map(({ id, name }) => ({ id, label: name })),
    [workgroups],
  );

  return (
    <Stack gap={2} sx={{ p: 2, overflowY: "auto" }}>
      <Typography variant="body2" color="text.secondary">
        {PRECEDENCE_HELP}
      </Typography>
      {(featureOverrides ?? []).map((feature) => (
        <FeatureOverridesCard
          key={feature.feature}
          feature={feature}
          userOptions={userOptions}
          workgroupOptions={workgroupOptions}
        />
      ))}
    </Stack>
  );
};
