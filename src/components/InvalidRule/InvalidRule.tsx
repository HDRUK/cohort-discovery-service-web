import { Stack, StackProps } from "@mui/material";
import ErrorIcon from "../ErrorIcon";

const InvalidRule = ({
  reasons,
  minimised = false,
  stackProps,
  innerStackProps,
}: {
  reasons: string[];
  minimised?: boolean;
  stackProps?: StackProps;
  innerStackProps?: StackProps;
}) => {
  return minimised ? (
    <ErrorIcon data-testid="ErrorIcon" />
  ) : (
    <Stack direction="column" gap={1} {...stackProps}>
      {reasons.map((reason) => (
        <Stack
          direction="row"
          key={reason}
          alignItems="center"
          gap={1}
          {...innerStackProps}
        >
          <ErrorIcon data-testid="ErrorIcon" />
          {reason}
        </Stack>
      ))}
    </Stack>
  );
};

export default InvalidRule;
