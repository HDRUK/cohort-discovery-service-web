import ErrorIcon from "@/components/ErrorIcon";
import InvalidRule from "@/components/InvalidRule";
import { Button, Stack, Typography } from "@mui/material";

interface RuleSearchProps {
  customInvalidRule: boolean;
  handleConfirm: () => void;
  clearAll: () => void;
  invalidReason: string[] | undefined;
  selectedConceptsLength: number;
  isSelected: boolean;
  hasOptions?: boolean;
  isNLP?: boolean;
}

const RuleFooter = ({
  customInvalidRule,
  handleConfirm,
  clearAll,
  invalidReason,
  selectedConceptsLength = 0,
  isSelected,
  hasOptions,
  isNLP,
}: RuleSearchProps) => {
  const DEFAULT_CONFIRM_OR_CLEAR_MESSAGE =
    "Please confirm or clear your changes before continuing";
  const ALTERNATIVES_MESSAGE =
    "A rule has alternatives, please select one or more concepts";

  const pendingMessage =
    customInvalidRule && isSelected
      ? ALTERNATIVES_MESSAGE
      : selectedConceptsLength > 0
        ? DEFAULT_CONFIRM_OR_CLEAR_MESSAGE
        : null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      {pendingMessage ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            {pendingMessage}
          </Typography>
        </Stack>
      ) : (
        <InvalidRule reasons={invalidReason ?? []} />
      )}
      {(hasOptions || isNLP) && (
        <Stack direction="row" justifyContent="flex-end" gap={1} pt={1}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
          >
            Clear all
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={selectedConceptsLength < 1}
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
          >
            Confirm selection
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default RuleFooter;
