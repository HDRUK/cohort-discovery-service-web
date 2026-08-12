import { Concept } from "@/types/api";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { PREVIEW_SUBJECT_NOUN } from "@/utils/queryBuilder";

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

/**
 * Builds a demographic subject noun-phrase for the query preview, e.g.
 * "Males over 85". Returns null when neither sex nor a bounded age is set.
 */
export const formatDemographicSubject = (
  age: [number, number] | null,
  sex: Concept[],
): string | null => {
  const noun = formatSexNoun(sex);
  const agePhrase = formatAgePhrase(age);

  if (noun && agePhrase) return `${noun} ${agePhrase}`;
  if (noun) return noun;
  if (agePhrase) return `${PREVIEW_SUBJECT_NOUN} ${agePhrase}`;
  return null;
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
