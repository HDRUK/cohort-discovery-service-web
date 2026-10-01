import ErrorIcon from "@/components/ErrorIcon";
import InvalidRule from "@/components/InvalidRule";
import { Button, Stack, Typography } from "@mui/material";

export interface RuleFooterProps {
  invalidReason?: string[];
  message?: string;
  onConfirm?: () => void;
  onClearAll?: () => void;
  confirmDisabled?: boolean;
}

const RuleFooter = ({
  invalidReason,
  message,
  onConfirm,
  onClearAll,
  confirmDisabled = false,
}: RuleFooterProps) => {
  return (
    <Stack
      data-testid="rule-footer"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      {message ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexShrink={1}
          minWidth={0}
        >
          <ErrorIcon />
          <Typography variant="body2" noWrap sx={{ fontSize: 16 }}>
            {message}
          </Typography>
        </Stack>
      ) : (
        <InvalidRule
          reasons={invalidReason ?? []}
          stackProps={{ sx: { pt: 1, pb: 1, fontSize: 16 } }}
        />
      )}
      {onConfirm && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={1}
          pt={1}
          flexShrink={0}
        >
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClearAll?.();
            }}
          >
            Clear all
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={confirmDisabled}
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
