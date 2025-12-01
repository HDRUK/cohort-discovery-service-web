import { Box, Typography } from "@mui/material";

interface TableTitleProps {
  title: string;
  subTitle?: number | string;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  useSeparator?: boolean;
  small?: boolean;
}

const Title = ({
  title,
  subTitle,
  children,
  startIcon,
  useSeparator = true,
  small = false,
  ...rest
}: TableTitleProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "baseline",
        gap: 2,
        flexWrap: "nowrap",
        ...rest,
      }}
    >
      <Box>
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
            sx={{ flexShrink: 0, ml: 1 }}
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
