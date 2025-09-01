import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock = ({ code, ...rest }: { code: unknown }) => {
  const codeString =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);
  return (
    <SyntaxHighlighter language="json" style={materialLight} {...rest}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
