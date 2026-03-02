import { Box, BoxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface TitleProps extends Omit<BoxProps, "title"> {
  title: string | ReactNode;
  subTitle?: number | string | ReactNode;
  children?: ReactNode;
  startIcon?: ReactNode;
  useSeparator?: boolean;
  size?: "small" | "medium" | "large";
  wrapperSx?: BoxProps;
}

const Title = ({
  title,
  subTitle,
  children,
  startIcon,
  useSeparator = true,
  size = "medium",
  wrapperSx,
  ...rest
}: TitleProps) => {
  const titleVariant =
    size === "small" ? "body1" : size === "medium" ? "h4" : "h2";

  const subTitleVariant =
    size === "small" ? "h6" : size === "medium" ? "h5" : "h3";

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
      }}
      {...wrapperSx}
    >
      <Box display="flex" alignItems="baseline" {...rest}>
        <Typography
          variant={titleVariant}
          component="span"
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}
        >
          {startIcon} {title} {useSeparator && subTitle && "/"}
        </Typography>

        {subTitle && (
          <Typography
            variant={subTitleVariant}
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
