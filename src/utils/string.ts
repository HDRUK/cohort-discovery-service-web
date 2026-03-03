import crypto from "crypto";
import { DEFAULT_MAX_VARCHAR_LENGTH } from "@/config/defaults";

function capitaliseFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTokenKey(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const getEnumLabel = <T extends Record<string, string | number>>(
  enumObj: T,
  value: string | number,
  fixCase: boolean = true,
): string => {
  const entries = Object.entries(enumObj).filter(([key]) =>
    Number.isNaN(Number(key)),
  );

  const entry = entries.find(([, v]) => v === value);
  if (!entry) return String(value);

  const [rawKey] = entry;

  if (!fixCase) return rawKey;

  const pretty = rawKey.toLowerCase().replace(/_/g, " ");
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
};

const capVarChar = (
  s: string,
  max = DEFAULT_MAX_VARCHAR_LENGTH,
  addDots = false,
) =>
  `${[...s].slice(0, max).join("")} ${s.length > max && addDots ? "..." : ""}`;

const paramsToString = (params?: URLSearchParams | string) => {
  if (!params) return "";
  return params instanceof URLSearchParams ? params.toString() : params;
};

export {
  capitaliseFirstLetter,
  getTokenKey,
  capVarChar,
  getEnumLabel,
  paramsToString,
};
