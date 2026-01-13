import { Box, Divider, Grid } from "@mui/material";
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_RowData,
} from "material-react-table";
import React, { useMemo } from "react";
import { trueKeys } from "@/utils/numbers";
import RefreshButton, { RefreshButtonProps } from "@/components/RefreshButton";
import ReRunButton, { ReRunButtonProps } from "../ReRunButton/ReRunButton";
import DownloadButton, {
  DownloadButtonProps,
} from "@/components/DownloadButton";
import SortButton, { SortButtonProps } from "@/components/SortButton";
import EditButton, { EditButtonProps } from "@/components/EditButton";
import DeleteButton, { DeleteButtonProps } from "@/components/DeleteButton";
import Title, { TitleProps } from "@/components/Title";
import ControlledSearchBox, {
  ControlledSearchBoxProps,
} from "@/modules/ControlledSearchBox";

export interface TableProps {
  leftAction?: {
    titleProps?: TitleProps;
    searchProps?: ControlledSearchBoxProps;
  };
  rightAction?: {
    refreshProps?: RefreshButtonProps;
    reRunProps?: ReRunButtonProps;
    deleteProps?: Omit<DeleteButtonProps, "onClick"> & {
      onClick?: (selectedRowIds: string[]) => void;
    };
    downloadProps?: Omit<DownloadButtonProps, "onClick"> & {
      onClick?: (selectedRowIds: string[]) => void;
    };
    sortProps?: SortButtonProps;
    editProps?: Omit<EditButtonProps, "onClick"> & {
      onClick?: (selectedRowIds: string[]) => void;
    };
  };
  details?: React.ReactNode;
}

type DTableProps<TData extends MRT_RowData> = MaterialReactTableProps<TData> &
  TableProps;

const Table = <TData extends MRT_RowData>({
  leftAction,
  rightAction,
  details,
  ...props
}: DTableProps<TData>) => {
  const { table } = props;
  const { rowSelection = {} } = table?.getState() || {};

  const selectedRows = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const { titleProps, searchProps } = leftAction || {};
  const {
    sortProps,
    editProps,
    refreshProps,
    reRunProps,
    deleteProps,
    downloadProps,
  } = rightAction || {};

  const { onClick: onDeleteClick, ...restDeleteProps } = deleteProps ?? {};
  const { onClick: onDownloadClick, ...restDownloadProps } =
    downloadProps ?? {};
  const { onClick: onEditClick, ...restEditProps } = editProps ?? {};

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
      {(rightAction || leftAction) && (
        <Grid container gap={1} sx={{ pb: details ? 0 : 0.5 }}>
          <Grid size={"grow"}>
            {leftAction && titleProps && <Title {...titleProps} />}
            {leftAction && searchProps && (
              <ControlledSearchBox {...searchProps} />
            )}
          </Grid>
          <Grid size={"auto"}>
            {rightAction && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {sortProps && <SortButton {...sortProps} />}

                {refreshProps && <RefreshButton {...refreshProps} />}

                {reRunProps && <ReRunButton {...reRunProps} />}

                {editProps && (
                  <EditButton
                    {...restEditProps}
                    onClick={() => onEditClick?.(selectedRows)}
                  />
                )}

                {deleteProps && (
                  <DeleteButton
                    {...restDeleteProps}
                    onClick={() => onDeleteClick?.(selectedRows)}
                  />
                )}

                {downloadProps && (
                  <DownloadButton
                    {...restDownloadProps}
                    onClick={() => onDownloadClick?.(selectedRows)}
                  />
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      )}
      {details && (
        <Box sx={{ pb: 1 }}>
          <Divider /> {details}
        </Box>
      )}
      <MaterialReactTable {...props} />
    </Box>
  );
};

export default Table;
