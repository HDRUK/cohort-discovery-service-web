import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Box } from "@mui/material";

import type { ComponentProps } from "react";

type SyntaxHighlighterProps = ComponentProps<typeof SyntaxHighlighter>;

interface CodeBlockProps extends Omit<SyntaxHighlighterProps, "children"> {
  code: unknown;
}

const CodeBlock = ({ code, ...rest }: CodeBlockProps) => {
  const codeString =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);

  return (
    <Box>
      <SyntaxHighlighter language="json" style={materialDark} {...rest}>
        {codeString}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CodeBlock;
