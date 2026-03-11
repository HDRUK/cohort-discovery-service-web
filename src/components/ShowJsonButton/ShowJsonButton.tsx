"use client";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import CodeBlock from "../CodeBlock";
import ShowOnClick from "../ShowOnClick";
import CodeIcon from "@mui/icons-material/Code";
import CopyableTextButton from "../CopyableTextButton";
import useUserStore from "@/hooks/useUserStore";
import { checkIsAdmin } from "@/utils/user";

const ShowJsonButton = () => {
  const { queryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
  }));
  const user = useUserStore((st) => st.user);
  const isAdmin = checkIsAdmin(user);

  if (!isAdmin) return;

  return (
    <ShowOnClick
      dialogTitle={"Query Builder JSON"}
      icon={<CodeIcon />}
      modalProps={{
        additionalActions: (
          <CopyableTextButton text={JSON.stringify(queryBuilderJson)} />
        ),
      }}
    >
      <CodeBlock code={queryBuilderJson} />
    </ShowOnClick>
  );
};

export default ShowJsonButton;
