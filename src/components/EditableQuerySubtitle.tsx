"use client";

import { useQueryClient } from "@tanstack/react-query";
import updateQuery from "@/actions/query/updateQuery";
import EditableText from "@/components/EditableText";
import { QUERY_KEYS } from "@/config/tags";

export default function EditableQuerySubtitle({
  defaultValue,
  queryId,
  queryPid,
}: {
  defaultValue: string;
  queryId: number;
  queryPid: string;
}) {
  const queryClient = useQueryClient();

  const renameQuery = async (name: string) => {
    await updateQuery(queryId, { name });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.queries() }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.query(queryPid) }),
    ]);
  };

  return (
    <EditableText
      showIcon
      typographyProps={{
        component: "span",
        variant: "h5",
      }}
      textFieldProps={{
        placeholder: "Edit query name here",
        variant: "standard",
        size: "small",
        slotProps: {
          input: {
            sx: (theme) => ({
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              lineHeight: theme.typography.h5.lineHeight,
            }),
          },
        },
      }}
      defaultValue={defaultValue}
      onCommit={renameQuery}
    />
  );
}
