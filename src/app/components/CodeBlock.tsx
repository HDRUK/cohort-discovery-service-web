import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/styles/prism";

const CodeBlock = ({ code }: { code: unknown }) => {
  const codeString = JSON.stringify(code, null, 2);
  return (
    <SyntaxHighlighter language="json" style={materialLight}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
