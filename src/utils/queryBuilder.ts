import { ConceptOperator, RuleGroupType, RuleNodeType } from "@/types/rules";
import { isRuleGroup, isRuleLeaf, isSingleConcept } from "@/utils/rules";

const queryToText = (node: RuleGroupType) => {
  const subject = "People who";
  const getVerb = (category: string): string => {
    switch (category) {
      case "Drug":
        return "received";
      case "Observation":
        return "observed with";
      case "Measured":
        return "measured with";
      case "Condition":
        return "diagnosed with";
      default:
        return "associated with";
    }
  };

  const cleanDescription = (s: string) => {
    // to be implemented
    // - some of the concepts have very long names
    //   which could be reduced here
    return s;
  };

  const leafText = (rule: ConceptOperator) => {
    const c = rule.concept;
    if (!c) {
      return { verb: null, text: null };
    }
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

  const render = (
    n: RuleNodeType,
    parentComb: string | null = null
  ): { verb?: string; text: string; comb: string }[] => {
    if (isRuleLeaf(n)) {
      const { verb, text } = leafText(n.rule);
      if (!text) return [];
      let phrase = verb ? `${verb} ${text}` : text;
      if (n.exclude) phrase = `not (${phrase})`;
      return [{ verb, text: phrase, comb: n.combinator }];
    }

    if (isRuleGroup(n)) {
      const comb = n.combinator;
      const parts = n.rules
        .flatMap((child) => render(child, child.combinator))
        .filter((x) => !!x);

      const grouped = [];
      let currentVerb = null;
      let currentTexts: string[] = [];

      for (const p of parts) {
        const sameVerb = (p.verb || "") === (currentVerb || "");

        const stripped = p.verb
          ? p.text.replace(new RegExp(`^${p.verb}\\s+`, "i"), "")
          : p.text;

        if (sameVerb && currentTexts.length) {
          currentTexts.push(stripped);
        } else {
          if (currentTexts.length) {
            grouped.push({
              verb: currentVerb || undefined,
              text: currentTexts.join(` ${p.comb} `),
            });
          }
          currentVerb = p.verb || undefined;
          currentTexts = [stripped];
        }
      }

      if (currentTexts.length) {
        grouped.push({
          verb: currentVerb || undefined,
          text: currentTexts.join(` ${comb} `),
        });
      }

      let combined = grouped
        .map((g) => (g.verb ? `${g.verb} ${g.text}` : g.text))
        .join(` ${comb} `);

      if (n.exclude) combined = `not (${combined})`;
      if (parentComb && parentComb !== comb) combined = `(${combined})`;

      return [{ text: combined, comb }];
    }

    return [];
  };

  const body = render(node)
    .map((p) => p.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return `${subject} ${body}`;
};

export { queryToText };
