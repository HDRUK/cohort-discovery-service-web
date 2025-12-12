"use client";
import useQueryBuilder from "@/store/useQueryBuilder";
import CodeBlock from "../CodeBlock";
import ShowOnClick from "../ShowOnClick";
import CodeIcon from "@mui/icons-material/Code";
import CopyableTextButton from "../CopyableTextButton";

const ShowJsonButton = () => {
  const { queryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
  }));

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
