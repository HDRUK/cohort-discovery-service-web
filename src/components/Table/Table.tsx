import { Box } from "@mui/material";
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_RowData,
} from "material-react-table";

const Table = <TData extends MRT_RowData>(
  props: MaterialReactTableProps<TData>
) => {
  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <MaterialReactTable {...props} />
    </Box>
  );
};

export default Table;
