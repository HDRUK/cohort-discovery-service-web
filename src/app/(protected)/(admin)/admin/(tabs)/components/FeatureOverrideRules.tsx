"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import replaceFeatureOverrides from "@/actions/admin/replaceFeatureOverrides";
import FormMultiSelect, {
  OptionsType,
} from "@/components/FormMultiSelect/FormMultiSelect";
import {
  useAdminUsers,
  useAdminWorkgroups,
} from "@/contexts/AdminSectionContext";
import { useNotify } from "@/providers/NotifyProvider";
import {
  FeatureOverride,
  FeatureOverrides,
  FeatureOverridesUpdate,
} from "@/types/features";

interface OverrideRule {
  enabled: boolean;
  workgroups: number[];
  users: number[];
}

type RuleSubject = "workgroups" | "users";

const PRECEDENCE_HELP =
  "A user's own rule wins. Otherwise the flag is on if any of their workgroups is in the on rule, off if any is in the off rule, and the global value if neither.";

const valueLabel = (enabled: boolean) => (enabled ? "On" : "Off");

const toRules = ({ users, workgroups }: FeatureOverrides): OverrideRule[] =>
  [true, false]
    .map((enabled) => ({
      enabled,
      workgroups: workgroups
        .filter((override) => override.enabled === enabled)
        .map(({ id }) => id),
      users: users
        .filter((override) => override.enabled === enabled)
        .map(({ id }) => id),
    }))
    .filter((rule) => rule.workgroups.length + rule.users.length > 0);

const toUpdate = (rules: OverrideRule[]): FeatureOverridesUpdate => ({
  users: rules.flatMap(({ enabled, users }) =>
    users.map((id) => ({ id, enabled })),
  ),
  workgroups: rules.flatMap(({ enabled, workgroups }) =>
    workgroups.map((id) => ({ id, enabled })),
  ),
});

const fingerprint = (update: FeatureOverridesUpdate) =>
  JSON.stringify([
    [...update.users].sort((a, b) => a.id - b.id),
    [...update.workgroups].sort((a, b) => a.id - b.id),
  ]);

const withOverriddenSubjects = (
  options: OptionsType[],
  overrides: FeatureOverride[],
  label: (override: FeatureOverride) => string,
): OptionsType[] => [
  ...options,
  ...overrides
    .filter(({ id }) => !options.some(({ value }) => value === id))
    .map((override) => ({ value: override.id, label: label(override) })),
];

const userLabel = ({ name, email }: { name: string; email?: string }) =>
  email ? `${name} (${email})` : name;

interface FeatureOverrideRulesProps {
  feature: FeatureOverrides;
}

export const FeatureOverrideRules = ({
  feature,
}: FeatureOverrideRulesProps) => {
  const users = useAdminUsers();
  const workgroups = useAdminWorkgroups();
  const notify = useNotify();
  const [pending, startTransition] = useTransition();
  const [rules, setRules] = useState<OverrideRule[]>(() => toRules(feature));

  const options = useMemo<Record<RuleSubject, OptionsType[]>>(
    () => ({
      users: withOverriddenSubjects(
        (users ?? []).map((user) => ({
          value: user.id,
          label: userLabel(user),
        })),
        feature.users,
        userLabel,
      ),
      workgroups: withOverriddenSubjects(
        (workgroups ?? []).map(({ id, name }) => ({ value: id, label: name })),
        feature.workgroups,
        ({ name }) => name,
      ),
    }),
    [users, workgroups, feature],
  );

  const isDirty =
    fingerprint(toUpdate(rules)) !== fingerprint(toUpdate(toRules(feature)));

  const updateRule = (index: number, change: Partial<OverrideRule>) =>
    setRules((current) =>
      current.map((rule, i) => (i === index ? { ...rule, ...change } : rule)),
    );

  const subjectOptions = (index: number, subject: RuleSubject) => {
    const usedElsewhere = new Set(
      rules.flatMap((rule, i) => (i === index ? [] : rule[subject])),
    );
    return options[subject].map((option) => ({
      ...option,
      disabled: usedElsewhere.has(Number(option.value)),
    }));
  };

  const addRule = () =>
    setRules((current) => [
      ...current,
      {
        enabled: current[0] ? !current[0].enabled : !feature.global,
        workgroups: [],
        users: [],
      },
    ]);

  const save = () =>
    startTransition(async () => {
      try {
        await replaceFeatureOverrides(feature.feature, toUpdate(rules));
      } catch {
        notify.error(
          `Could not save the overrides for "${feature.feature}". Try again, or refresh the page if it keeps failing.`,
        );
      }
    });

  return (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        {PRECEDENCE_HELP}
      </Typography>
      {rules.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No override rules. Everyone gets the global value.
        </Typography>
      )}
      {rules.map((rule, index) => {
        const label = valueLabel(rule.enabled);
        return (
          <Box key={label} role="group" aria-label={`${label} rule`}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid size={2}>
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={rule.enabled}
                    disabled={pending || rules.length > 1}
                    slotProps={{
                      input: { "aria-label": `${label} rule value` },
                    }}
                    onChange={(event) =>
                      updateRule(index, { enabled: event.target.checked })
                    }
                  />
                  <Typography variant="body2">{label}</Typography>
                </Stack>
              </Grid>
              {(["workgroups", "users"] as const).map((subject) => {
                const subjectOptionsForRule = subjectOptions(index, subject);
                return (
                  <Grid key={subject} size={subject === "users" ? 5 : 4}>
                    <FormMultiSelect
                      id={`${feature.feature}-${label}-${subject}`}
                      label={subject === "users" ? "Users" : "Workgroups"}
                      multiple
                      disabled={pending}
                      options={subjectOptionsForRule}
                      value={subjectOptionsForRule.filter(({ value }) =>
                        rule[subject].includes(Number(value)),
                      )}
                      onChange={(value) =>
                        updateRule(index, {
                          [subject]: (Array.isArray(value)
                            ? value
                            : [value]
                          ).map((option) => Number(option.value)),
                        })
                      }
                    />
                  </Grid>
                );
              })}
              <Grid size={1}>
                <Tooltip title="Remove rule">
                  <span>
                    <IconButton
                      aria-label={`Remove the ${label.toLowerCase()} rule`}
                      disabled={pending}
                      onClick={() =>
                        setRules((current) =>
                          current.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        );
      })}
      <Stack direction="row" alignItems="center" gap={1}>
        {rules.length < 2 && (
          <Button variant="outlined" disabled={pending} onClick={addRule}>
            Add rule
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {pending && <CircularProgress size={16} />}
        <Button
          disabled={pending || !isDirty}
          onClick={() => setRules(toRules(feature))}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          disabled={pending || !isDirty}
          onClick={save}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
