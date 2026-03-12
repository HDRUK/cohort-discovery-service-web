import { ConceptOperator, RuleGroupType, RuleNodeType } from "@/types/rules";
import {
  isAgeFilter,
  isMultipleConcept,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  isSingleConcept,
} from "@/utils/rules";
import { mapDomain } from "./domains";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { UniqueIdentifier } from "@dnd-kit/core";

type Piece = { verb?: string | null; text: string };

const queryToText = (
  node: RuleGroupType,
  options?: { includeBrackets?: boolean },
) => {
  const includeBrackets = options?.includeBrackets ?? false;
  const subject = "People who";

  const getVerb = (category: string, exclude: boolean = false): string => {
    if (exclude) {
      switch (category) {
        case "Drug":
          return "did not receive";
        case "Observation":
          return "were not observed with";
        case "Measurement":
        case "Measured":
          return "were not measured with";
        case "Condition":
          return "were not diagnosed with";
        case "Race":
          return "were not recorded as having race";
        case "Gender":
          return `were not recorded as having ${mapDomain(
            "gender",
          ).toLowerCase()}`;
        default:
          return "were not associated with";
      }
    }

    switch (category) {
      case "Drug":
        return "received";
      case "Observation":
        return "were observed with";
      case "Measurement":
      case "Measured":
        return "were measured with";
      case "Condition":
        return "were diagnosed with";
      case "Race":
        return "were recorded as having race";
      case "Gender":
        return `were recorded as having ${mapDomain("gender").toLowerCase()}`;
      default:
        return "were associated with";
    }
  };

  const cleanDescription = (s: string) => {
    if (!s) return s;

    let out = s.trim();

    out = out.replace(/SARS[-–—]CoV[-–—]?2\s*\(COVID[-–—]?19\)/gi, "COVID-19");
    out = out.replace(/\s*-\s*COVID-19\s*vaccine\b/gi, " COVID-19 vaccine");
    out = out.replace(/\s*vaccine(?:\s+AZD\d+)?\b/gi, " vaccine");
    out = out.replace(/\bperson\/patient\b/gi, "person");
    out = out.replace(/\s*\(\s*\)/g, "");

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
      return `which occurred between ${fmt(low)} and ${fmt(high!)}`;
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
    if (!c) return { verb: null, text: null, category: undefined };

    if (isSingleConcept(c)) {
      const verb = getVerb(c.category, exclude);
      const desc = cleanDescription(c.name);
      return { verb, text: desc, category: c.category };
    }

    if (isMultipleConcept(c)) {
      const texts =
        c.alternatives
          ?.filter((x) => !!x)
          .map((x) => cleanDescription(x.name))
          .join(" or ") || "";
      const verb = getVerb(c.category, exclude);
      return { verb, text: texts, category: c.category };
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

export { queryToText, collapsibleGuidanceKey };
