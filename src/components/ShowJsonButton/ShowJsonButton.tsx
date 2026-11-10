"use client";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import CodeBlock from "../CodeBlock";
import ShowOnClick from "../ShowOnClick";
import CodeIcon from "@mui/icons-material/Code";
import CopyableTextButton from "../CopyableTextButton";
import { useSessionUser } from "@/contexts/SessionDataContext";
import { checkIsAdmin } from "@/utils/user";

const NODE_ENV = process.env.NODE_ENV;

const ShowJsonButton = () => {
  const { queryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
  }));
  const user = useSessionUser();
  const isAdmin = checkIsAdmin(user);

  if (!isAdmin && NODE_ENV !== "development") return;

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
