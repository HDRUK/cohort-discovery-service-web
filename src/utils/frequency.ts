import { FrequencyMode, frequencyMap } from "@/types/api";
import { capitaliseFirstLetter } from "./string";

function getFrequencyModeKey(value: string): string | undefined {
  return capitaliseFirstLetter(
    (Object.keys(FrequencyMode) as (keyof typeof FrequencyMode)[])
      .find((key) => FrequencyMode[key] === value)
      ?.toLocaleLowerCase() ?? "",
  );
}

function clampRunTimeFrequency(
  mode: number,
  runTime: number | undefined,
): number {
  const optionCount = frequencyMap[String(mode) as FrequencyMode]?.length ?? 0;
  return runTime !== undefined &&
    Number.isInteger(runTime) &&
    runTime >= 0 &&
    runTime < optionCount
    ? runTime
    : 0;
}

export { getFrequencyModeKey, clampRunTimeFrequency };
