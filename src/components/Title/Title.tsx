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
  titleOverflow?: "ellipsis" | "scroll" | "wrap" | "visible";
}

const Title = ({
  title,
  subTitle,
  children,
  startIcon,
  useSeparator = true,
  size = "medium",
  wrapperSx,
  titleOverflow = "ellipsis",
  ...rest
}: TitleProps) => {
  const titleVariant =
    size === "small" ? "body1" : size === "medium" ? "h4" : "h2";

  const subTitleVariant =
    size === "small" ? "h6" : size === "medium" ? "h5" : "h3";

  let overflowStyles: React.CSSProperties = {};

  switch (titleOverflow) {
    case "ellipsis":
      overflowStyles = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      };
      break;

    case "scroll":
      overflowStyles = {
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
      };
      break;

    case "wrap":
      overflowStyles = {
        whiteSpace: "normal",
        overflow: "visible",
        wordBreak: "break-word",
      };
      break;

    case "visible":
    default:
      overflowStyles = {};
  }

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "wrap",
      }}
      {...wrapperSx}
    >
      <Box display="flex" alignItems="baseline" {...rest}>
        <Typography
          variant={titleVariant}
          component="span"
          sx={{
            minWidth: 0,
            ...overflowStyles,
            display: "flex",
            gap: 1,
          }}
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
