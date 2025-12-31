import { Box, Divider, Grid } from "@mui/material";
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_RowData,
} from "material-react-table";
import React, { useMemo } from "react";
import { trueKeys } from "@/utils/numbers";
import RevalidateButton from "@/components/RevalidateButton";
import DownloadButton from "../DownloadButton";
import { DownloadButtonProps } from "../DownloadButton/DownloadButton";
import SortButton, { SortButtonProps } from "../SortButton/SortButton";
import EditButton, { EditButtonProps } from "../EditButton";
import { RevalidateButtonProps } from "../RevalidateButton/RevalidateButton";
import DeleteButton, { DeleteButtonProps } from "../DeleteButton";
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
    refreshProps?: RevalidateButtonProps;
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
  const { sortProps, editProps, refreshProps, deleteProps, downloadProps } =
    rightAction || {};

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

                {refreshProps && <RevalidateButton {...refreshProps} />}

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
