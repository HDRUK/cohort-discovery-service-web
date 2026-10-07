import ErrorIcon from "@/components/ErrorIcon";
import { DEFAULT_CONFIRM_OR_CLEAR_MESSAGE } from "@/config/defaults";
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
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      {customInvalidRule ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            {isSelected
              ? "A rule has alternatives, please select one or more concepts"
              : DEFAULT_CONFIRM_OR_CLEAR_MESSAGE}
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            {!isSelected || selectedConceptsLength > 0
              ? DEFAULT_CONFIRM_OR_CLEAR_MESSAGE
              : invalidReason}
          </Typography>
        </Stack>
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
