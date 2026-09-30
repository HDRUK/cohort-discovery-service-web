import ErrorIcon from "@/components/ErrorIcon";
import InvalidRule from "@/components/InvalidRule";
import { RuleLeafType } from "@/types/rules";
import { Button, Stack, Typography } from "@mui/material";

interface RuleSearchProps {
  customInvalidRule: boolean;
  handleConfirm: () => void;
  clearAll: () => void;
  rule: RuleLeafType;
  selectedConceptsLength: number;
  isSelected: boolean;
  hasOptions?: boolean;
  isNLP?: boolean;
}

const RuleFooter = ({
  customInvalidRule,
  handleConfirm,
  clearAll,
  rule,
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
              : "Please confirm or clear your changes before continuing"}
          </Typography>
        </Stack>
      ) : !isSelected ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            Please confirm or clear your changes before continuing
          </Typography>
        </Stack>
      ) : (
        <InvalidRule
          reasons={rule.invalidReason ?? []}
          stackProps={{ sx: { pt: 1, pb: 1, fontSize: 16 } }}
        />
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
