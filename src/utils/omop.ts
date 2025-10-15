import { Code } from "@/types/api";
import { Option } from "@/types/common";

const codesToOption = (codes: Code[]): Option[] =>
  codes
    ?.filter((code) => code.name !== "0")
    .sort((a, b) => a.description.localeCompare(b.description))
    .map((code) => ({
      name: code.name,
      label: `${code.description} (${code.name}) `,
    }));

export { codesToOption };
