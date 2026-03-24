import { FrequencyMode } from "@/types/api";
import { capitaliseFirstLetter } from "./string";

function getFrequencyModeKey(value: string): string | undefined {
  return capitaliseFirstLetter(
    (Object.keys(FrequencyMode) as (keyof typeof FrequencyMode)[])
      .find((key) => FrequencyMode[key] === value)
      ?.toLocaleLowerCase() ?? "",
  );
}

export { getFrequencyModeKey };
