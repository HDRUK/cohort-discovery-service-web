"use client";

import updateQuery from "@/actions/query/updateQuery";
import { revalidateAction } from "@/actions/revalidate";
import EditableText from "@/components/EditableText";
import { getTagQuery, TAG_QUERIES } from "@/config/tags";

async function setQueryName(id: number, pid: string, name: string) {
  await updateQuery(id, { name });
  revalidateAction(TAG_QUERIES);
  revalidateAction(getTagQuery(pid));
}

export default function EditableQuerySubtitle({
  defaultValue,
  queryId,
  queryPid,
}: {
  defaultValue: string;
  queryId: number;
  queryPid: string;
}) {
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
      onCommit={(value) => setQueryName(queryId, queryPid, value)}
    />
  );
}
