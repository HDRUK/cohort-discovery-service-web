import { Tooltip } from "@mui/material";
import ErrorIcon from "../ErrorIcon";

const InvalidRule = ({ reasons }: { reasons: string[] }) => (
  <Tooltip title={reasons.join(" ")}>
    <ErrorIcon data-testid="ErrorIcon" />
  </Tooltip>
);

export default InvalidRule;
