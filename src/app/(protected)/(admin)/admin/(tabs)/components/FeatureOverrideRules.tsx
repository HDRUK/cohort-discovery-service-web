"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import replaceFeatureOverrides from "@/actions/admin/replaceFeatureOverrides";
import Modal from "@/components/Modal";
import { useNotify } from "@/providers/NotifyProvider";
import { FeatureOverrides, OverrideRule } from "@/types/features";
import FeatureOverrideModal from "./FeatureOverrideModal";
import {
  addToRules,
  removeRule,
  toRules,
  toUpdate,
  userLabel,
  valueLabel,
} from "./overrideRules";

const PRECEDENCE_HELP =
  "A user's own rule always wins. Otherwise the flag is on if any of their workgroups is in the On rule, even if another of their workgroups is in the Off rule. To switch it off for someone in an On workgroup, add them to the Off rule as a user. Deactivated workgroups still count.";

interface FeatureOverrideRulesProps {
  feature: FeatureOverrides;
}

type ModalState =
  | { kind: "edit"; enabled: boolean | null }
  | { kind: "remove"; enabled: boolean }
  | null;

export const FeatureOverrideRules = ({
  feature,
}: FeatureOverrideRulesProps) => {
  const notify = useNotify();
  const [pending, startTransition] = useTransition();
  const [modal, setModal] = useState<ModalState>(null);
  const rules = toRules(feature);

  const save = (next: OverrideRule[]) =>
    startTransition(async () => {
      try {
        await replaceFeatureOverrides(feature.feature, toUpdate(next));
        setModal(null);
      } catch {
        notify.error(
          `Could not save the overrides for "${feature.feature}". Try again, or refresh the page if it keeps failing.`,
        );
      }
    });

  const closeModal = () => setModal(null);

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
      {rules.map(({ enabled }) => {
        const label = valueLabel(enabled);
        return (
          <Stack
            key={label}
            role="group"
            aria-label={`${label} rule`}
            direction="row"
            alignItems="center"
            gap={2}
          >
            <Chip
              label={label}
              color={enabled ? "success" : "default"}
              size="small"
            />
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, flexGrow: 1 }}
            >
              {feature.workgroups
                .filter((override) => override.enabled === enabled)
                .map(({ id, name }) => (
                  <Chip
                    key={`workgroup-${id}`}
                    label={name}
                    variant="outlined"
                  />
                ))}
              {feature.users
                .filter((override) => override.enabled === enabled)
                .map((override) => (
                  <Chip
                    key={`user-${override.id}`}
                    label={userLabel(override)}
                    variant="outlined"
                  />
                ))}
            </Box>
            <Tooltip title="Edit rule">
              <span>
                <IconButton
                  aria-label={`Edit the ${label.toLowerCase()} rule`}
                  disabled={pending}
                  onClick={() => setModal({ kind: "edit", enabled })}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Remove rule">
              <span>
                <IconButton
                  aria-label={`Remove the ${label.toLowerCase()} rule`}
                  disabled={pending}
                  onClick={() => setModal({ kind: "remove", enabled })}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      })}
      <Stack direction="row" alignItems="center" gap={1}>
        <Button
          variant="outlined"
          disabled={pending}
          onClick={() => setModal({ kind: "edit", enabled: null })}
        >
          Add override
        </Button>
        {pending && <CircularProgress size={16} />}
      </Stack>
      {modal?.kind === "edit" && (
        <FeatureOverrideModal
          feature={feature}
          rules={rules}
          editing={modal.enabled}
          pending={pending}
          onClose={closeModal}
          onSave={(rule) =>
            save(
              modal.enabled === null
                ? addToRules(rules, rule)
                : addToRules(removeRule(rules, modal.enabled), rule),
            )
          }
        />
      )}
      {modal?.kind === "remove" && (
        <Modal
          open
          maxWidth="xs"
          title={`Remove the ${valueLabel(modal.enabled).toLowerCase()} rule?`}
          onClose={closeModal}
          actionLabel="Cancel"
          additionalActions={
            <Button
              variant="contained"
              color="error"
              disabled={pending}
              onClick={() => save(removeRule(rules, modal.enabled))}
            >
              Remove
            </Button>
          }
        >
          <Typography variant="body2">
            Everyone in this rule goes back to the global value for{" "}
            {feature.feature}.
          </Typography>
        </Modal>
      )}
    </Stack>
  );
};
