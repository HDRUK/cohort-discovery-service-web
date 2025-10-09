"use client";

import ShowOnClick from "@/components/ShowOnClick";
import CodeBlock from "@/components/CodeBlock";
import CodeIcon from "@mui/icons-material/Code";
import { useDaphneStore } from "@/store/useDaphneStore";

const RuleMenu = () => {
  const {
    queryBuilder: { queryBuilderJson },
  } = useDaphneStore();
  return (
    <ShowOnClick icon={<CodeIcon />}>
      <CodeBlock code={queryBuilderJson} />{" "}
    </ShowOnClick>
  );
};

export default RuleMenu;
