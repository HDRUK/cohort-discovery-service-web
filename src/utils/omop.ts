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

const getDomainVerbs = (category: string) => {
  switch (category) {
    case "condition":
      return {
        verb: "diagnosed",
        verbPastTense: "was diagnosed",
        noun: "diagnosis",
      };
    case "drug":
      return {
        verb: "taken",
        verbPastTense: "was taken",
        noun: "intake",
      };
    case "observation":
      return {
        verb: "observed",
        verbPastTense: "was observed",
        noun: "observation",
      };
    case "measurement":
      return {
        verb: "measured",
        verbPastTense: "was measured",
        noun: "measurement",
      };
    case "gender":
      return {
        verb: "recorded",
        verbPastTense: "was recorded",
        noun: "record",
      };
    default:
      return {
        verb: "recorded",
        verbPastTense: "was recorded",
        noun: "record",
      };
  }
};

export { codesToOption, getDomainVerbs };
