import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconButton, Box } from "@mui/material";
import { CopyAllOutlined } from "@mui/icons-material";
import { useNotify } from "@/providers/NotifyProvider";
import type { ComponentProps } from "react";

type SyntaxHighlighterProps = ComponentProps<typeof SyntaxHighlighter>;

interface CodeBlockProps extends Omit<SyntaxHighlighterProps, "children"> {
  code: unknown;
}

const CodeBlock = ({ code, ...rest }: CodeBlockProps) => {
  const notify = useNotify();
  const codeString =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    notify.success("Copied to clipboard");
  };
  return (
    <Box sx={{ display: "flex", direction: "row" }}>
      <Box>
        <SyntaxHighlighter language="json" style={materialLight} {...rest}>
          {codeString}
        </SyntaxHighlighter>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton onClick={handleCopy}>
          <CopyAllOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CodeBlock;
