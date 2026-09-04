import { Concept } from "@/types/api";
import {
  ConceptOperator,
  DeathStatus,
  GeoRadiusLocation,
  RuleGroupType,
  RuleNodeType,
} from "@/types/rules";
import {
  hasAlternatives,
  isAgeFilter,
  isMultipleConcept,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  isSingleConcept,
} from "@/utils/rules";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { UniqueIdentifier } from "@dnd-kit/core";
import { extractPostcode, formatRadius } from "@/components/GeoMap";
import { getDomainPhrase } from "./omop";

type Piece = { verb?: string | null; text: string };

export const PREVIEW_SUBJECT_NOUN = "People";

const queryRulesToText = (
  node: RuleGroupType,
  options?: { includeBrackets?: boolean },
) => {
  const includeBrackets = options?.includeBrackets ?? false;
  const subject = `${PREVIEW_SUBJECT_NOUN} who`;

  const getVerb = (category: string, exclude = false): string => {
    const domain = getDomainPhrase(category);
    return exclude ? domain.exclude : domain.include;
  };

  const cleanDescription = (s: string, aggressive = false) => {
    if (!s) return s;

    let out = s.trim();
    if (aggressive) {
      //dont use by default
      out = out.replace(
        /SARS[-–—]CoV[-–—]?2\s*\(COVID[-–—]?19\)/gi,
        "COVID-19",
      );
      out = out.replace(/\s*-\s*COVID-19\s*vaccine\b/gi, " COVID-19 vaccine");
      out = out.replace(/\s*vaccine(?:\s+AZD\d+)?\b/gi, " vaccine");
      out = out.replace(/\bperson\/patient\b/gi, "person");
      out = out.replace(/\s*\(\s*\)/g, "");
    }

    return out.trim();
  };

  const isDemographicCategory = (category?: string) => {
    return ["Gender", "Race", "Ethnicity"].includes(category || "");
  };

  const isEventCategory = (category?: string) => {
    return [
      "Observation",
      "Condition",
      "Drug",
      "Measurement",
      "Measured",
      "Procedure",
      "Visit",
    ].includes(category || "");
  };

  const formatAgeRangeCore = (
    age?: [number | null, number | null],
  ): string | null => {
    if (!age) return null;

    const [low, high] = age;

    if (low == null && high == null) return null;
    if (low != null && high == null) return `over ${low} years`;
    if (low == null && high != null) return `under ${high} years`;
    return `between ${low} and ${high} years`;
  };

  const formatAgeConstraint = (
    age?: [number | null, number | null],
    category?: string,
  ): string | null => {
    const core = formatAgeRangeCore(age);
    if (!core) return null;

    if (isDemographicCategory(category)) {
      return `are currently aged ${core}`;
    }

    if (isEventCategory(category)) {
      return `when they were aged ${core}`;
    }

    return `when aged ${core}`;
  };

  const formatTimeConstraint = (
    time?: [string | null, string | null],
    category?: string,
  ): string | null => {
    if (!time) return null;

    const [low, high] = time;

    const fmt = (d: string) => {
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return d;
      return date.toISOString().slice(0, 10);
    };

    if (low == null && high == null) return null;

    if (isEventCategory(category)) {
      if (low != null && high == null)
        return `which occurred after ${fmt(low)}`;
      if (low == null && high != null)
        return `which occurred before ${fmt(high)}`;
      return `which occurred between ${fmt(low!)} and ${fmt(high!)}`;
    }

    if (isDemographicCategory(category)) {
      if (low != null && high == null) {
        return `which was recorded after ${fmt(low)}`;
      }
      if (low == null && high != null) {
        return `which was recorded before ${fmt(high)}`;
      }
      return `which was recorded between ${fmt(low!)} and ${fmt(high!)}`;
    }

    if (low != null && high == null)
      return `which was recorded after ${fmt(low)}`;
    if (low == null && high != null)
      return `which was recorded before ${fmt(high)}`;
    return `which was recorded between ${fmt(low!)} and ${fmt(high!)}`;
  };

  const leafText = (
    rule: ConceptOperator,
    exclude: boolean,
  ): { verb: string | null; text: string | null; category?: string } => {
    const c = rule.concept;

    if (!c) return { verb: null, text: "[blank]", category: undefined };

    if (isSingleConcept(c)) {
      const verb = getVerb(c.category, exclude);
      const desc = `${cleanDescription(c.name)}${
        !c.concept_id ? " [unknown]" : ""
      }`;
      return { verb, text: desc, category: c.category };
    }

    if (hasAlternatives(c)) {
      const text = `${cleanDescription(c.name)} [alternatives found]`;
      const verb = getVerb(c.category, exclude);
      return { verb, text, category: c.category };
    }

    if (isMultipleConcept(c)) {
      const names = c
        .map((concept) => cleanDescription(concept.name))
        .join(" or ");
      const verb = getVerb(c[0].category, exclude);
      return { verb, text: names, category: c[0].category };
    }

    return { verb: null, text: null, category: undefined };
  };

  const stripLeadingVerb = (verb: string, phrase: string) => {
    const escapedVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${escapedVerb}\\s+`, "i");
    return phrase.replace(re, "");
  };

  const joinList = (items: string[], combinator: "and" | "or") => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];

    const isComplex = (text: string) =>
      text.includes(" and ") ||
      text.includes(" or ") ||
      text.includes(" when ") ||
      text.includes(" which ") ||
      text.includes(",");

    if (items.length === 2) {
      return isComplex(items[0]) || isComplex(items[1])
        ? `${items[0]}, ${combinator} ${items[1]}`
        : `${items[0]} ${combinator} ${items[1]}`;
    }

    return `${items.slice(0, -1).join(", ")}, ${combinator} ${items.at(-1)}`;
  };

  const render = (n: RuleNodeType, isTopLevel = false): Piece[] => {
    if (isOperator(n)) {
      const text = (n.combinator || "").toLowerCase() === "or" ? "or" : "and";
      return [{ text }];
    }

    if (isAgeFilter(n)) {
      const [minAge, maxAge] = n.value;

      if (
        [MIN_AGE_FILTER, null].includes(minAge) &&
        [MAX_AGE_FILTER, null].includes(maxAge)
      ) {
        return [{ text: "are of any age" }];
      }

      if (
        minAge != null &&
        minAge > MIN_AGE_FILTER &&
        [MAX_AGE_FILTER, null].includes(maxAge)
      ) {
        return [{ text: `are older than ${minAge} years` }];
      }

      if (
        [MIN_AGE_FILTER, null].includes(minAge) &&
        maxAge != null &&
        maxAge < MAX_AGE_FILTER
      ) {
        return [{ text: `are younger than ${maxAge} years` }];
      }

      if (minAge != null && maxAge != null) {
        return [{ text: `are between ${minAge} and ${maxAge} years old` }];
      }

      return [];
    }

    if (isRuleLeaf(n)) {
      const { verb, text, category } = leafText(n.rule, n.exclude ?? false);

      if (!text) return [];

      const basePhrase = verb ? `${verb} ${text}` : text;

      const constraints: string[] = [];
      const ageText = formatAgeConstraint(n.ageConstraint, category);
      const timeText = formatTimeConstraint(n.timeConstraint, category);

      if (ageText) constraints.push(ageText);
      if (timeText) constraints.push(timeText);

      if (constraints.length === 0) {
        return [{ verb: verb ?? null, text: basePhrase }];
      }

      if (constraints.length === 0) {
        return [{ verb: verb ?? null, text: basePhrase }];
      }

      return [
        {
          verb: verb ?? null,
          text: `${basePhrase} ${constraints.join(" ")}`
            .replace(/\s+/g, " ")
            .trim(),
        },
      ];
    }

    if (isRuleGroup(n)) {
      const rawParts: Piece[] = (n.rules || [])
        .flatMap((child) => render(child))
        .filter((x): x is Piece => Boolean(x && x.text));

      if (rawParts.length === 0) return [];

      const merged: string[] = [];
      let i = 0;
      let hasAnd = false;
      let hasOr = false;

      while (i < rawParts.length) {
        const curr = rawParts[i];

        if (curr.text === "and" || curr.text === "or") {
          merged.push(curr.text);
          if (curr.text === "and") hasAnd = true;
          else hasOr = true;
          i += 1;
          continue;
        }

        if (curr.verb) {
          const verb = curr.verb;
          const items: string[] = [stripLeadingVerb(verb, curr.text)];
          let joiner: "and" | "or" | null = null;
          let j = i + 1;

          while (
            j + 1 < rawParts.length &&
            (rawParts[j].text === "and" || rawParts[j].text === "or") &&
            rawParts[j + 1].verb === verb
          ) {
            const op = rawParts[j].text as "and" | "or";
            if (joiner && joiner !== op) break;
            joiner = op;
            items.push(stripLeadingVerb(verb, rawParts[j + 1].text));
            j += 2;
          }

          const connector = joiner || "and";

          if (items.length === 1) {
            merged.push(`${verb} ${items[0]}`);
          } else {
            merged.push(`${verb} ${joinList(items, connector)}`);
            if (connector === "and") hasAnd = true;
            else hasOr = true;
          }

          i = j;
          continue;
        }

        merged.push(curr.text);
        i += 1;
      }

      const segments: string[] = [];
      const operators: ("and" | "or")[] = [];
      let currentSegment = "";

      for (const token of merged) {
        if (token === "and" || token === "or") {
          if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
            currentSegment = "";
          }
          operators.push(token);
          if (token === "and") hasAnd = true;
          else hasOr = true;
        } else {
          currentSegment = currentSegment
            ? `${currentSegment} ${token}`
            : token;
        }
      }

      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
      }

      let combined = "";

      if (
        segments.length > 0 &&
        operators.length === segments.length - 1 &&
        operators.every((op) => op === "and")
      ) {
        combined = joinList(segments, "and");
      } else if (
        segments.length > 0 &&
        operators.length === segments.length - 1 &&
        operators.every((op) => op === "or")
      ) {
        combined = joinList(segments, "or");
      } else {
        combined = merged.join(" ");
      }

      combined = combined.replace(/\s+/g, " ").trim();

      const needsParens = includeBrackets || (hasAnd && hasOr);

      if (needsParens && !isTopLevel) {
        combined = `(${combined})`;
      }

      return [{ text: combined }];
    }

    return [];
  };

  const body = render(node, true)
    .map((p) => p.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (body.length === 0) return "";
  return `${subject} ${body}`;
};

const collapsibleGuidanceKey = (
  componentName: string,
  selected: Record<UniqueIdentifier, boolean>,
) => {
  const keySuffix =
    Object.keys(selected).length === 1 ? Object.keys(selected)[0] : "multiple";

  return `${componentName}-${keySuffix}`;
};

const pluralise = (name: string): string =>
  name.endsWith("s") ? name : `${name}s`;

const formatSexNoun = (sex: Concept[]): string | null => {
  if (!sex?.length) return null;
  return sex.map((c) => pluralise(c.name)).join(" or ");
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
  const place = address
    ? (extractPostcode(address) ?? address)
    : `(${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  return `living within ${formatRadius(radius)} of ${place}`;
};

const formatDeathPhrase = (death: DeathStatus | null): string | null => {
  if (death === DeathStatus.UNKNOWN_OR_ALIVE) {
    return "with death status unknown/alive";
  }

  if (death === DeathStatus.DEATH_RECORDED) {
    return "with a death record";
  }

  return null;
};

/**
 * Builds a demographic subject noun-phrase for the query preview, e.g.
 * "Males over 85 living within 5.0 km of London". Returns null when none of
 * sex, a bounded age, or a location is set.
 */
const formatDemographicSubject = (
  age: [number, number] | null,
  sex: Concept[],
  location: GeoRadiusLocation | null = null,
  death: DeathStatus | null = null,
): string | null => {
  const noun = formatSexNoun(sex);
  const agePhrase = formatAgePhrase(age);
  const locationPhrase = formatLocationPhrase(location);
  const deathPhrase = formatDeathPhrase(death);

  if (!noun && !agePhrase && !locationPhrase && !deathPhrase) return null;

  const parts = [noun ?? PREVIEW_SUBJECT_NOUN];
  if (agePhrase) parts.push(agePhrase);
  if (locationPhrase) parts.push(locationPhrase);
  if (deathPhrase) parts.push(deathPhrase);
  return parts.join(" ");
};

/**
 * Splices a demographic subject into a preview sentence by replacing the
 * leading "People" noun (e.g. "People who ..." -> "Males over 85 who ...").
 */
const applyDemographicSubject = (
  queryText: string,
  subject: string,
): string => {
  if (queryText.length === 0) return subject;
  if (queryText.startsWith(`${PREVIEW_SUBJECT_NOUN} `)) {
    return `${subject}${queryText.slice(PREVIEW_SUBJECT_NOUN.length)}`;
  }
  return queryText;
};

/**
 * Renders a query definition as its full preview sentence, folding the
 * demographics block (age, sex, location) into the concept-rule text. This is
 * the single entry point for turning a definition into text everywhere a query
 * is displayed. The full definition — rules and demographics — is the text, so
 * the demographics block is always included when present.
 *
 * The demographic subject replaces the leading "People" noun, so it always
 * scopes the entire "who ..." clause regardless of whether the rules are
 * combined with OR, AND, or a mix — matching the AND intersection of the
 * demographics filter with the rule tree.
 */
const queryToText = (
  definition: RuleGroupType,
  options?: { includeBrackets?: boolean },
): string => {
  const queryText = queryRulesToText(definition, options);

  const demographics = definition.demographics;
  const subject = demographics
    ? formatDemographicSubject(
        demographics.age,
        demographics.sex,
        demographics.location,
        demographics.death,
      )
    : null;
  return subject ? applyDemographicSubject(queryText, subject) : queryText;
};

export { queryToText, collapsibleGuidanceKey };
