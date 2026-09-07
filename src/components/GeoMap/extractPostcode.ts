const UK_POSTCODE_PATTERN = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/gi;

// Nominatim's `display_name` always places the real postcode just before the
// country, so taking the last match avoids false positives from
// postcode-shaped substrings earlier in the string (e.g. in a building name).
export const extractPostcode = (address: string): string | null => {
  const matches = [...address.matchAll(UK_POSTCODE_PATTERN)];
  if (matches.length === 0) return null;

  const compact = matches[matches.length - 1][0].toUpperCase().replace(/\s+/g, "");
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
};
