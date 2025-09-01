import { Box, Typography } from "@mui/material";

interface TableTitleProps {
  title: string;
  subTitle?: number | string;
  children?: React.ReactNode;
}

const Title = ({ title, subTitle, children, ...rest }: TableTitleProps) => {
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
      <Typography variant="h4"> {title} </Typography>
      {subTitle && <Typography variant="h5">{subTitle} </Typography>}
      {children}
    </Box>
  );
};

export default Title;
