import { Code, Option } from "@/types/api";

const findBestMatch = (
  value: string,
  options: Option[]
): Option | undefined => {
  if (typeof value === "number") return undefined;
  const lowerValue = value?.toLowerCase();
  if (!lowerValue) return;

  let bestScore = -Infinity;
  let bestOption: Option | undefined;
  if (!options) return;
  for (const opt of options) {
    const label = opt.label.toLowerCase();

    let score = 0;
    if (label === lowerValue) {
      score = 100;
    } else if (label.includes(lowerValue)) {
      score = 80 - (label.indexOf(lowerValue) ?? 0);
    } else {
      const commonChars = [...lowerValue].filter((char) =>
        label.includes(char)
      ).length;
      score = commonChars;
    }

    if (score > bestScore) {
      bestScore = score;
      bestOption = opt;
    }
  }

  return bestOption;
};

const codesToOption = (codes: Code[]): Option[] =>
  codes
    ?.filter((code) => code.name !== "0")
    .sort((a, b) => a.description.localeCompare(b.description))
    .map((code) => ({
      name: code.name,
      label: `${code.description} (${code.name}) `,
    }));

export { codesToOption, findBestMatch };
