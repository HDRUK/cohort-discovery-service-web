import { Box, BoxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface TableTitleProps extends BoxProps {
  title: string;
  subTitle?: number | string | ReactNode;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  useSeparator?: boolean;
  small?: boolean;
  wrapperSx?: BoxProps;
}

const Title = ({
  title,
  subTitle,
  children,
  startIcon,
  useSeparator = true,
  small = false,
  wrapperSx,
  ...rest
}: TableTitleProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
      }}
      {...wrapperSx}
    >
      <Box display={"flex"} alignItems={"baseline"} {...rest}>
        <Typography
          variant={small ? "body1" : "h4"}
          component="span"
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}
        >
          {startIcon} {title} {useSeparator && subTitle && "/"}
        </Typography>

        {subTitle && (
          <Typography
            variant={small ? "h6" : "h5"}
            component="span"
            noWrap
            sx={{ flexShrink: 0, mx: 1 }}
          >
            {subTitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default Title;
