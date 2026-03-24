import { Box, BoxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface TitleProps extends Omit<BoxProps, "title"> {
  title: string | ReactNode;
  subTitle?: number | string | ReactNode;
  children?: ReactNode;
  startIcon?: ReactNode;
  size?: "small" | "medium" | "large";
  wrapperSx?: BoxProps;
}

const ConceptTitle = ({
  title,
  subTitle,
  children,
  startIcon,
  size = "medium",
  wrapperSx,
  ...rest
}: TitleProps) => {
  const titleVariant =
    size === "small" ? "body1" : size === "medium" ? "h4" : "h2";

  const subTitleVariant =
    size === "small" ? "h6" : size === "medium" ? "h5" : "h3";

  console.log("rest", rest);
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
          sx={{ overflow: "scroll", minWidth: 0 }}
        >
          {startIcon} {title}
        </Typography>

        {subTitle && (
          <Typography
            variant={subTitleVariant}
            component="span"
            noWrap
            sx={{ flexShrink: 0, ml: "10px" }}
          >
            {subTitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default ConceptTitle;
