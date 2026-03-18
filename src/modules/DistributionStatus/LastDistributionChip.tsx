import { ReactNode, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { getDatetime } from "@/utils/date";
import { ResultFile } from "@/types/api";
import { formatNumber } from "@/utils/numbers";

export default function LastDistributionChip({
  children,
  file,
}: {
  children?: ReactNode;
  file?: ResultFile | null;
}) {
  const [open, setOpen] = useState(false);

  const extraData = [
    { label: "Created At", value: getDatetime(file?.created_at) },
    {
      label: "Rows processed",
      value: formatNumber(file?.rows_processed),
    },
    {
      label: "Status",
      value: file?.status,
    },
  ];

  return (
    <Box>
      <Chip
        clickable
        onClick={() => setOpen((prev) => !prev)}
        label={`Last Distribution ${getDatetime(file?.created_at)}`}
      />
      {children}
      {file && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Table size="small">
            <TableBody>
              {extraData.map((row) => (
                <TableRow key={row.label}>
                  <TableCell sx={{ fontWeight: 600, width: "40%" }}>
                    {row.label}:
                  </TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>
      )}
    </Box>
  );
}
