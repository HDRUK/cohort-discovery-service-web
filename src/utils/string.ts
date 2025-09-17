import crypto from "crypto";

function capitaliseFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTokenKey(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export { capitaliseFirstLetter, getTokenKey };
