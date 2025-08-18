import { Box, Typography } from "@mui/material";

interface TableTitleProps {
  name: string;
  count: number;
}

const TableTitle = ({ name, count }: TableTitleProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "baseline",
        gap: 2,
        flexWrap: "nowrap",
      }}
    >
      <Typography variant="h4"> {name} </Typography>
      <Typography variant="h5">{count} </Typography>
    </Box>
  );
};

export default TableTitle;
