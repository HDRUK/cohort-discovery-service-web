import InvalidRule from "@/components/InvalidRule";
import { Button, Stack } from "@mui/material";

interface RuleFooterProps {
  messages: string[];
  showActions: boolean;
  canConfirm: boolean;
  onConfirm: () => void;
  onClear: () => void;
}

const RuleFooter = ({
  messages,
  showActions,
  canConfirm,
  onConfirm,
  onClear,
}: RuleFooterProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      <InvalidRule reasons={messages} />
      {showActions && (
        <Stack direction="row" justifyContent="flex-end" gap={1} pt={1}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            Clear all
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={!canConfirm}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
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
