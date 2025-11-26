import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_RowData,
} from "material-react-table";
import { useMemo } from "react";
import { trueKeys } from "@/utils/numbers";

type TableProps<TData extends MRT_RowData> = MaterialReactTableProps<TData> & {
  handleDeleteRows?: (rowIds: string[]) => void;
};

const Table = <TData extends MRT_RowData>({
  handleDeleteRows,
  ...props
}: TableProps<TData>) => {
  const { table } = props;
  const { rowSelection = {} } = table?.getState() || {};

  const selectedRows = useMemo(() => trueKeys(rowSelection), [rowSelection]);

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
      <Box
        sx={{
          minHeight: 40,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {selectedRows?.length > 0 && handleDeleteRows && (
          <IconButton onClick={() => handleDeleteRows(selectedRows)}>
            <DeleteIcon data-testid="DeleteIcon" />
          </IconButton>
        )}
      </Box>

      <MaterialReactTable {...props} />
    </Box>
  );
};

export default Table;
