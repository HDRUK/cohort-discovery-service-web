import { Concept } from "@/types/api";
import { GeoRadiusLocation } from "@/types/rules";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { PREVIEW_SUBJECT_NOUN } from "@/utils/queryBuilder";
import { formatRadius } from "@/components/GeoMap";

const pluralizeSex = (name: string): string =>
  name.endsWith("s") ? name : `${name}s`;

const formatSexNoun = (sex: Concept[]): string | null => {
  if (sex.length === 0) return null;
  return sex.map((c) => pluralizeSex(c.name)).join(" or ");
};

const formatAgePhrase = (age: [number, number] | null): string | null => {
  if (!age) return null;
  const [min, max] = age;
  const noLower = min <= MIN_AGE_FILTER;
  const noUpper = max >= MAX_AGE_FILTER;

  if (noLower && noUpper) return null;
  if (!noLower && noUpper) return `over ${min}`;
  if (noLower && !noUpper) return `under ${max}`;
  return `between ${min} and ${max}`;
};

const formatLocationPhrase = (
  location: GeoRadiusLocation | null,
): string | null => {
  if (!location) return null;
  const { lat, lon, radius, address } = location;
  const place = address ?? `(${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  return `living within ${formatRadius(radius)} of ${place}`;
};

/**
 * Builds a demographic subject noun-phrase for the query preview, e.g.
 * "Males over 85 living within 5.0 km of London". Returns null when none of
 * sex, a bounded age, or a location is set.
 */
export const formatDemographicSubject = (
  age: [number, number] | null,
  sex: Concept[],
  location: GeoRadiusLocation | null = null,
): string | null => {
  const noun = formatSexNoun(sex);
  const agePhrase = formatAgePhrase(age);
  const locationPhrase = formatLocationPhrase(location);

  if (!noun && !agePhrase && !locationPhrase) return null;

  const parts = [noun ?? PREVIEW_SUBJECT_NOUN];
  if (agePhrase) parts.push(agePhrase);
  if (locationPhrase) parts.push(locationPhrase);
  return parts.join(" ");
};

/**
 * Splices a demographic subject into a preview sentence by replacing the
 * leading "People" noun (e.g. "People who ..." -> "Males over 85 who ...").
 */
export const applyDemographicSubject = (
  queryText: string,
  subject: string,
): string => {
  if (queryText.length === 0) return subject;
  if (queryText.startsWith(`${PREVIEW_SUBJECT_NOUN} `)) {
    return `${subject}${queryText.slice(PREVIEW_SUBJECT_NOUN.length)}`;
  }
  return queryText;
};
