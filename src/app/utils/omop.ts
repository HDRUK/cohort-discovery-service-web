import { Code } from "../types/api";

const codesToOption = (codes: Code[]) =>
  codes
    .filter((code) => code.name !== "0")
    .sort((a, b) => a.description.localeCompare(b.description))
    .map((code) => ({
      name: code.name,
      label: `${code.description} (${code.name}) `,
    }));

export { codesToOption };
