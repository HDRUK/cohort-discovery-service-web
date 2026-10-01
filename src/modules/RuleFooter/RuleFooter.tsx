import ErrorIcon from "@/components/ErrorIcon";
import InvalidRule from "@/components/InvalidRule";
import { RuleLeafType } from "@/types/rules";
import { Button, Stack, Typography } from "@mui/material";

export interface RuleFooterProps {
  customInvalidRule: boolean;
  isSelected: boolean;
  rule: RuleLeafType;
  handleConfirm: () => void;
  clearAll: () => void;
  selectedConceptsLength: number;
  isNLP?: boolean;
}

const RuleFooter = ({
  customInvalidRule,
  isSelected,
  rule,
  handleConfirm,
  clearAll,
  selectedConceptsLength,
}: RuleFooterProps) => {
  const promptMessage = customInvalidRule
    ? "A rule has alternatives, please select one or more concepts"
    : "Please confirm or clear your changes before continuing";

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      {customInvalidRule || !isSelected ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            {promptMessage}
          </Typography>
        </Stack>
      ) : (
        <InvalidRule
          reasons={rule.invalidReason ?? []}
          stackProps={{ sx: { pt: 1, pb: 1, fontSize: 16 } }}
        />
      )}
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
    </Stack>
  );
};

export default RuleFooter;
