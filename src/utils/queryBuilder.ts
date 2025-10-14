import { ConceptOperator, RuleGroupType, RuleNodeType } from "@/types/rules";
import {
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  isSingleConcept,
} from "@/utils/rules";

type Piece = { verb?: string | null; text: string };

const queryToText = (node: RuleGroupType) => {
  const subject = "People who";

  const getVerb = (category: string): string => {
    switch (category) {
      case "Drug":
        return "received";
      case "Observation":
        return "observed with";
      case "Measurement":
      case "Measured":
        return "measured with";
      case "Condition":
        return "diagnosed with";
      default:
        return "associated with";
    }
  };

  const cleanDescription = (s: string) => {
    if (!s) return s;

    let out = s.trim();

    // Normalize COVID phrasing
    out = out.replace(/SARS[-–—]CoV[-–—]?2\s*\(COVID[-–—]?19\)/gi, "COVID-19");

    // Shorten common vaccine suffixes
    out = out.replace(/\s*-\s*COVID-19\s*vaccine\b/gi, " COVID-19 vaccine");
    out = out.replace(/\s*vaccine(?:\s+AZD\d+)?\b/gi, " vaccine");

    // Tidy punctuation/spacing
    out = out.replace(/\bperson\/patient\b/gi, "person");
    out = out.replace(/\s*\(\s*\)/g, "");

    return out.trim();
  };

  const leafText = (
    rule: ConceptOperator
  ): { verb: string | null; text: string | null } => {
    const c = rule.concept;
    if (!c) return { verb: null, text: null };

    if (isSingleConcept(c)) {
      const verb = getVerb(c.category);
      const desc = cleanDescription(c.description);
      return { verb, text: desc };
    }

    if (Array.isArray(c) && c.length > 0) {
      const texts = c
        .filter((x) => !!x)
        .map((x) => cleanDescription(x.description))
        .join(" or ");
      const verb = getVerb(c[0].category);
      return { verb, text: texts };
    }

    return { verb: null, text: null };
  };

  const render = (n: RuleNodeType, isTopLevel = false): Piece[] => {
    if (isOperator(n)) {
      const text = (n.combinator || "").toLowerCase() === "or" ? "or" : "and";
      return [{ text }];
    }

    if (isRuleLeaf(n)) {
      const { verb, text } = leafText(n.rule);
      if (!text) return [];
      let phrase = verb ? `${verb} ${text}` : text;
      if (n.exclude) phrase = `not (${phrase})`;
      return [{ verb: verb ?? null, text: phrase }];
    }

    if (isRuleGroup(n)) {
      const rawParts: Piece[] = (n.rules || [])
        .flatMap((child) => render(child))
        .filter((x): x is Piece => Boolean(x && x.text));

      if (rawParts.length === 0) return [];

      const stripLeadingVerb = (verb: string, phrase: string) => {
        const re = new RegExp(`^${verb}\\s+`, "i");
        return phrase.replace(re, "");
      };

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
            merged.push(`${verb} ${items.join(` ${connector} `)}`);
            if (connector === "and") hasAnd = true;
            else hasOr = true;
          }

          i = j;
          continue;
        }

        merged.push(curr.text);
        i += 1;
      }

      let combined = merged.join(" ").replace(/\s+/g, " ").trim();
      const needsParens = hasAnd && hasOr;
      if (needsParens && !isTopLevel) combined = `(${combined})`;

      return [{ text: combined }];
    }

    return [];
  };

  const body = render(node, true)
    .map((p) => p.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return `${subject} ${body}`;
};

export { queryToText };
