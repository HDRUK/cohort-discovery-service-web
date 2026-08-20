import crypto from "crypto";
import { DEFAULT_MAX_VARCHAR_LENGTH } from "@/config/defaults";

function capitaliseFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTokenKey(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const hashString = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

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

// Deterministic (byte-order) comparison so the canonical form is stable across
// environments — avoids locale-sensitive ordering from localeCompare.
const byKeyThenValue = (
  [ka, va]: [string, string],
  [kb, vb]: [string, string],
) => (ka !== kb ? (ka < kb ? -1 : 1) : va === vb ? 0 : va < vb ? -1 : 1);

// Sort params by key then value so query-string ordering (e.g. the order of
// repeated collection_pid[] values) doesn't produce distinct cache keys.
const canonicaliseQueryString = (params?: URLSearchParams | string) => {
  const usp = new URLSearchParams(paramsToString(params));
  const sorted = new URLSearchParams();
  [...usp.entries()]
    .sort(byKeyThenValue)
    .forEach(([key, value]) => sorted.append(key, value));
  return sorted.toString();
};

export {
  capitaliseFirstLetter,
  getTokenKey,
  hashString,
  capVarChar,
  getEnumLabel,
  paramsToString,
  canonicaliseQueryString,
};
