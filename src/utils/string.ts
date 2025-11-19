import crypto from "crypto";
import { MAX_VARCHAR_LENGTH } from "@/config/defaults";

function capitaliseFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTokenKey(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const capVarChar = (s: string, max = MAX_VARCHAR_LENGTH, addDots = false) =>
  `${[...s].slice(0, max).join("")} ${addDots ? "..." : ""}`;

export { capitaliseFirstLetter, getTokenKey, capVarChar };
