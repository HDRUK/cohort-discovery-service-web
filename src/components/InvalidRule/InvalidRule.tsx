import { Stack, StackProps } from "@mui/material";
import ErrorIcon from "../ErrorIcon";

const InvalidRule = ({
  reasons,
  collapsed = false,
  stackProps,
  innerStackProps,
}: {
  reasons: string[];
  collapsed?: boolean;
  stackProps?: StackProps;
  innerStackProps?: StackProps;
}) => {
  return collapsed ? (
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
