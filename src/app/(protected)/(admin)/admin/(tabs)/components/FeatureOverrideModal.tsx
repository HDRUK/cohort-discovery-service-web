import { useMemo, useState } from "react";
import { Button, Stack, Switch, Typography } from "@mui/material";
import FormMultiSelect, {
  OptionsType,
} from "@/components/FormMultiSelect/FormMultiSelect";
import Modal from "@/components/Modal";
import {
  useAdminUsers,
  useAdminWorkgroups,
} from "@/contexts/AdminSectionContext";
import { FeatureOverrides, OverrideRule, RuleSubject } from "@/types/features";
import {
  excludedIds,
  userLabel,
  valueLabel,
  withOverriddenSubjects,
} from "./overrideRules";

const SUBJECT_LABELS: Record<RuleSubject, string> = {
  workgroups: "Workgroups",
  users: "Users",
};

interface FeatureOverrideModalProps {
  feature: FeatureOverrides;
  rules: OverrideRule[];
  editing: boolean | null;
  pending: boolean;
  onClose: () => void;
  onSave: (rule: OverrideRule) => void;
}

const FeatureOverrideModal = ({
  feature,
  rules,
  editing,
  pending,
  onClose,
  onSave,
}: FeatureOverrideModalProps) => {
  const users = useAdminUsers();
  const workgroups = useAdminWorkgroups();
  const isEditing = editing !== null;
  const editedRule = rules.find((rule) => rule.enabled === editing);
  const otherRules = rules.filter((rule) => rule.enabled !== editing);
  const [enabled, setEnabled] = useState(
    editing ?? (rules[0] ? !rules[0].enabled : !feature.global),
  );
  const [selected, setSelected] = useState<Record<RuleSubject, number[]>>({
    workgroups: editedRule?.workgroups ?? [],
    users: editedRule?.users ?? [],
  });

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

  const optionsFor = (subject: RuleSubject, value: boolean) => {
    const excluded = excludedIds(otherRules, value, subject);
    return options[subject].map((option) => ({
      ...option,
      disabled: excluded.includes(Number(option.value)),
    }));
  };

  const changeValue = (value: boolean) => {
    setEnabled(value);
    setSelected((current) => ({
      workgroups: current.workgroups.filter(
        (id) => !excludedIds(otherRules, value, "workgroups").includes(id),
      ),
      users: current.users.filter(
        (id) => !excludedIds(otherRules, value, "users").includes(id),
      ),
    }));
  };

  const hasSelection = selected.workgroups.length + selected.users.length > 0;

  return (
    <Modal
      open
      maxWidth="sm"
      title={isEditing ? "Edit override" : "Add override"}
      onClose={onClose}
      actionLabel="Cancel"
      additionalActions={
        <Button
          variant="contained"
          disabled={pending || !hasSelection}
          onClick={() => onSave({ enabled, ...selected })}
        >
          Save
        </Button>
      }
    >
      <Stack gap={3}>
        <Typography variant="body2" color="text.secondary">
          {feature.feature}
        </Typography>
        <Stack direction="row" alignItems="center">
          <Switch
            checked={enabled}
            disabled={pending}
            slotProps={{ input: { "aria-label": "Override value" } }}
            onChange={(event) => changeValue(event.target.checked)}
          />
          <Typography variant="body2">{valueLabel(enabled)}</Typography>
        </Stack>
        {(["workgroups", "users"] as const).map((subject) => {
          const subjectOptions = optionsFor(subject, enabled);
          return (
            <FormMultiSelect
              key={subject}
              id={`${feature.feature}-${subject}`}
              label={SUBJECT_LABELS[subject]}
              multiple
              disabled={pending}
              options={subjectOptions}
              value={subjectOptions.filter(({ value }) =>
                selected[subject].includes(Number(value)),
              )}
              onChange={(value) =>
                setSelected((current) => ({
                  ...current,
                  [subject]: (Array.isArray(value) ? value : [value]).map(
                    (option) => Number(option.value),
                  ),
                }))
              }
            />
          );
        })}
      </Stack>
    </Modal>
  );
};

export default FeatureOverrideModal;
