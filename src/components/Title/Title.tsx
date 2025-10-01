import { Box, Typography } from "@mui/material";

interface TableTitleProps {
  title: string;
  subTitle?: number | string;
  children?: React.ReactNode;
  small?: boolean;
}

const Title = ({
  title,
  subTitle,
  children,
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
      <Typography variant={small ? "body1" : "h4"}> {title} </Typography>
      {subTitle && (
        <Typography variant={small ? "h6" : "h5"}>{subTitle} </Typography>
      )}
      {children}
    </Box>
  );
};

export default Title;
