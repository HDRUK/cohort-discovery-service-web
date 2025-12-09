import { Concept } from "@/types/api";
import {
  RuleGroupType,
  RuleLeafType,
  RuleNodeType,
  CombinatorType,
  ConceptOperator,
  BoardIndex,
  OperatorType,
} from "@/types/rules";
import { v4 as uuidv4 } from "uuid";

export enum RuleErrors {
  EMPTY_RULE = "A rule cannot be empty.",
  NO_NESTED_GROUPS = "Nested groups are not allowed.",
  GROUP_OPERATORS_ARE_THE_SAME = "All operators within a group must be the same.",
  GROUP_CANNOT_START_WITH_AN_OPERATOR = "A group cannot start with an operator.",
  GROUP_CANNOT_END_WITH_AN_OPERATOR = "A group cannot end with an operator.",
  RULE_NEEDS_OPERATOR = "Two rule conditions cannot be adjacent without an operator between them.",
  OPERATOR_NEEDS_RULE = "Two operators cannot be adjacent to each other.",
  GROUP_NEEDS_OPERATORS = "Each condition inside a group must be surrounded by operators.",
  GROUP_IS_INVALID = "A group contains errors.",
  MANY = "A group contains many errors.",
}

export const createRule = (
  rule: ConceptOperator = { concept: null },
  exclude = false
): RuleLeafType => ({
  id: uuidv4(),
  exclude,
  rule,
});

export const createRuleGroup = (
  rules: Array<RuleNodeType> = [createRule(), createOperator(), createRule()],
  exclude = false
): RuleGroupType => ({
  id: uuidv4(),
  exclude,
  rules,
});

export const createOperator = (
  combinator: CombinatorType = CombinatorType.AND
): OperatorType => ({
  id: uuidv4(),
  combinator,
});

export function ruleToGroup(
  r: RuleLeafType,
  opts?: {
    groupId?: string;
    groupCombinator?: CombinatorType;
    groupExclude?: boolean;
    childCombinator?: CombinatorType;
    childExclude?: boolean;
  }
): RuleGroupType {
  const groupCombinator = opts?.groupCombinator ?? CombinatorType.AND;

  const rule: RuleLeafType = { ...r, exclude: opts?.childExclude ?? r.exclude };

  const group: RuleGroupType = {
    id: opts?.groupId ?? uuidv4(),
    ...(opts?.groupExclude !== undefined ? { exclude: opts.groupExclude } : {}),
    rules: [createRule(), createOperator(groupCombinator), rule],
  };

  return group;
}

export const isEmptyRule = (rule: RuleLeafType): boolean =>
  rule.rule.concept === null;

export const isSingleConcept = (
  concept: Concept | null
): concept is Concept & { alternatives: undefined } =>
  concept != null && !isMultipleConcept(concept);

export const isMultipleConcept = (
  concept: Concept | null
): concept is Concept & { alternatives: Concept[] } =>
  concept != null &&
  Array.isArray(concept?.alternatives) &&
  concept!.alternatives.length > 0;

export const isRuleGroup = (n: RuleNodeType): n is RuleGroupType =>
  "rules" in n;
export const isRuleLeaf = (n: RuleNodeType): n is RuleLeafType => "rule" in n;

export const isOperator = (n: RuleNodeType): n is OperatorType =>
  "combinator" in n;

export const findById = (
  root: RuleNodeType,
  id: string
): RuleNodeType | undefined => {
  if (root.id === id) return root;

  if (isRuleGroup(root)) {
    for (const child of root.rules) {
      const found = findById(child, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const findByIdWithNeighbors = (
  root: RuleNodeType,
  id: string
): {
  above?: RuleNodeType;
  found?: RuleNodeType;
  below?: RuleNodeType;
} => {
  const flat: RuleNodeType[] = [];

  const dfs = (node: RuleNodeType) => {
    flat.push(node);
    if (isRuleGroup(node)) {
      for (const child of node.rules) {
        dfs(child);
      }
    }
  };

  dfs(root);

  const index = flat.findIndex((n) => n.id === id);
  if (index === -1) return {};

  return {
    above: flat[index - 1],
    found: flat[index],
    below: flat[index + 1],
  };
};

export const updateById = <T extends RuleNodeType>(
  root: T,
  id: string,
  updater: (node: RuleNodeType) => RuleNodeType,
  insert?: {
    node: RuleNodeType | RuleNodeType[];
    position?: "before" | "after";
  }
): T => {
  // If the target IS the root, we can only update it—no before/after insertion without parent context.
  if (root.id === id) {
    const updated = updater(root) as T;
    return updated;
  }

  if (isRuleGroup(root)) {
    let changed = false;
    const nextRules: RuleNodeType[] = [];

    // Normalise insert payload once
    const toArray = (n: RuleNodeType | RuleNodeType[]) =>
      Array.isArray(n) ? n : [n];
    const pos = insert?.position ?? "after";

    for (const child of root.rules) {
      if (child.id === id) {
        const updatedChild = updater(child);
        if (updatedChild !== child) changed = true;

        if (insert && pos === "before") {
          nextRules.push(...toArray(insert.node));
          changed = true;
        }

        nextRules.push(updatedChild);

        if (insert && pos === "after") {
          nextRules.push(...toArray(insert.node));
          changed = true;
        }
      } else {
        const updatedDesc = updateById(child, id, updater, insert);
        if (updatedDesc !== child) changed = true;
        nextRules.push(updatedDesc);
      }
    }

    if (!changed) return root;
    return { ...root, rules: nextRules } as T;
  }

  return root;
};

export const insertIntoGroup = <T extends RuleNodeType>(
  root: T,
  groupId: string,
  node: RuleNodeType,
  index?: number,
  opts?: { combinator?: CombinatorType; exclude?: boolean }
): T => {
  return updateById(root, groupId, (target) => {
    if (!isRuleGroup(target)) {
      return target;
    }

    const insertAt = Math.max(
      0,
      Math.min(
        typeof index === "number" ? index : target.rules.length,
        target.rules.length
      )
    );

    const nextRules = [
      ...target.rules.slice(0, insertAt),
      node,
      ...target.rules.slice(insertAt),
    ];

    const maybeWithCombinator =
      opts?.combinator !== undefined
        ? { ...target, combinator: opts.combinator }
        : target;

    const maybeWithExclude =
      opts?.exclude !== undefined
        ? { ...maybeWithCombinator, exclude: opts.exclude }
        : maybeWithCombinator;

    return { ...maybeWithExclude, rules: nextRules } as RuleNodeType;
  });
};

export function moveItemIntoGroup(
  root: RuleGroupType,
  itemId: string,
  to: string,
  toIndex: number | "end"
): RuleGroupType {
  const { root: newRoot, removed } = removeByIdWithNode(root, itemId);
  if (!removed) return root;

  const insertIndex = toIndex === "end" ? undefined : toIndex;

  return insertIntoGroup(newRoot, to, removed, insertIndex);
}

type RemoveResult<T> = { root: T; removed: RuleNodeType | null };

export const removeByIdWithNode = <T extends RuleNodeType>(
  root: T,
  id: string
): RemoveResult<T> => {
  if (root.id === id) {
    return { root, removed: root };
  }

  if (!isRuleGroup(root)) {
    return { root, removed: null };
  }

  let removed: RuleNodeType | null = null;
  let changed = false;
  const nextRules: RuleNodeType[] = [];

  for (const child of root.rules) {
    if (removed) {
      nextRules.push(child);
      continue;
    }

    if (child.id === id) {
      removed = child;
      changed = true;
      continue;
    }

    if (isRuleGroup(child)) {
      const res = removeByIdWithNode(child, id);
      if (res.removed) removed = res.removed;
      if (res.root !== child) changed = true;
      nextRules.push(res.root);
    } else {
      nextRules.push(child);
    }
  }

  if (!changed) {
    return { root, removed };
  }

  return { root: { ...root, rules: nextRules } as T, removed };
};

export const removeById = <T extends RuleNodeType>(root: T, id: string): T =>
  removeByIdWithNode(root, id).root;

export const buildIndexFromModel = (root: RuleGroupType): BoardIndex => {
  const itemsByGroup: Record<string, string[]> = { [root.id]: [] };
  const containers: string[] = [root.id];

  const visit = (container: string, group: RuleNodeType) => {
    if (!isRuleGroup(group)) return;
    itemsByGroup[container] ??= [];
    for (const entry of group.rules) {
      const id = entry.id;
      itemsByGroup[container].push(id);
      if (isRuleGroup(entry)) {
        const gid = entry.id;
        containers.push(gid);
        visit(gid, entry);
      }
    }
  };

  visit(root.id, root);
  return { containers, itemsByGroup };
};

export function validateRuleTree(
  root: RuleGroupType,
  options?: {
    constrainForBunnyV1: boolean;
  }
): RuleGroupType {
  const constrainForBunnyV1 = options?.constrainForBunnyV1 ?? false;

  const isContent = (n: RuleNodeType) => isRuleLeaf(n) || isRuleGroup(n);

  const setValid = <T extends RuleNodeType>(n: T, v: boolean): T => {
    if (isRuleGroup(n)) return { ...n, valid: v } as T;
    if (isRuleLeaf(n)) return { ...n, valid: v } as T;
    return { ...(n as OperatorType), valid: v } as T;
  };

  const getValid = (n: RuleNodeType) =>
    (isRuleGroup(n)
      ? n.valid
      : isRuleLeaf(n)
      ? n.valid
      : (n as OperatorType).valid) !== false;

  const getOperatorKind = (op: OperatorType): string => {
    return `${op.combinator}-${op.exclude ?? false}`;
  };

  const invalidateNode = (node: RuleNodeType, msg: string): RuleNodeType => {
    const anyNode: RuleNodeType = node;
    const existing: string[] = anyNode.invalidReason ?? [];
    const nextReasons = existing.includes(msg) ? existing : [...existing, msg];

    const nodeWithReason = {
      ...anyNode,
      invalidReason: nextReasons,
    } as RuleNodeType;
    return setValid(nodeWithReason, false);
  };

  const validateNode = (node: RuleNodeType): RuleNodeType => {
    const { invalidReason, ...nodeWithoutReason } = node;
    return setValid(nodeWithoutReason, true);
  };

  const validateGroup = (
    group: RuleGroupType,
    minChildren = 1,
    depth = 0
  ): RuleGroupType => {
    const groupReasons: string[] = [];
    const addGroupReason = (msg: string) => {
      if (!groupReasons.includes(msg)) {
        groupReasons.push(msg);
      }
    };

    const children = group.rules.map((child) => {
      if (isRuleGroup(child)) {
        // Bunny V1: no groups within groups
        if (constrainForBunnyV1 && depth >= 1) {
          return invalidateNode(child, RuleErrors.NO_NESTED_GROUPS);
        }
        return validateGroup(child, 2, depth + 1);
      }

      if (isRuleLeaf(child)) {
        const empty = isEmptyRule(child);
        if (empty) {
          return invalidateNode(child, RuleErrors.EMPTY_RULE);
        }
        return validateNode(child);
      }

      return validateNode(child);
    });

    const n = children.length;

    // Bunny V1: All operators within a group must be the same
    if (constrainForBunnyV1) {
      const operatorNodes = children.filter((c) => isOperator(c));
      if (operatorNodes.length > 1) {
        const firstKind = getOperatorKind(operatorNodes[0]);
        for (let i = 1; i < operatorNodes.length; i++) {
          const current = operatorNodes[i];
          const currentKind = getOperatorKind(current);
          if (currentKind !== firstKind) {
            const msg = RuleErrors.GROUP_OPERATORS_ARE_THE_SAME;
            const idx = children.indexOf(current);
            if (idx !== -1) {
              children[idx] = invalidateNode(children[idx], msg);
            }
          }
        }
      }
    }

    // Fail: cannot start with operator
    if (n > 0 && !isContent(children[0])) {
      children[0] = invalidateNode(
        children[0],
        RuleErrors.GROUP_CANNOT_START_WITH_AN_OPERATOR
      );
    }

    // Fail: cannot end with operator
    if (n > 0 && !isContent(children[n - 1])) {
      children[n - 1] = invalidateNode(
        children[n - 1],
        RuleErrors.GROUP_CANNOT_END_WITH_AN_OPERATOR
      );
    }

    // Fail pairs: content+content OR operator+operator
    for (let i = 0; i < n - 1; i++) {
      const a = children[i];
      const b = children[i + 1];
      const aIsContent = isContent(a);
      const bIsContent = isContent(b);

      if ((aIsContent && bIsContent) || (!aIsContent && !bIsContent)) {
        if (aIsContent && bIsContent) {
          const msg = RuleErrors.RULE_NEEDS_OPERATOR;

          children[i] = invalidateNode(children[i], msg);
          children[i + 1] = invalidateNode(children[i + 1], msg);
        } else {
          const msg = RuleErrors.OPERATOR_NEEDS_RULE;
          children[i] = invalidateNode(children[i], msg);
          children[i + 1] = invalidateNode(children[i + 1], msg);
        }
      }
    }

    // Optional stricter "sandwiched" pass:
    // Any content node (except first/last) must have operators on both sides.
    for (let i = 0; i < n; i++) {
      if (!isContent(children[i])) continue;
      const prev = children[i - 1];
      const next = children[i + 1];
      if ((i > 0 && !prev) || (i < n - 1 && !next)) continue;
      if (i > 0 && i < n - 1) {
        if (isContent(prev) || isContent(next)) {
          const msg = RuleErrors.GROUP_NEEDS_OPERATORS;

          children[i] = invalidateNode(children[i], msg);
          if (prev) children[i - 1] = invalidateNode(children[i - 1], msg);
          if (next) children[i + 1] = invalidateNode(children[i + 1], msg);
        }
      }
    }

    if (children.length < minChildren) {
      addGroupReason(
        `A group must contain at least ${minChildren} element${
          minChildren === 1 ? "" : "s"
        }.`
      );
    }

    const groupIsValid =
      children.length >= minChildren && children.every((c) => getValid(c));

    const reasonSet = new Set<string>(groupReasons);
    for (const child of children) {
      const childReasons: string[] | undefined = child.invalidReason;
      if (childReasons) {
        childReasons.forEach((r) => reasonSet.add(r));
      }
    }
    const reasons = Array.from(reasonSet);

    const invalidReason = groupIsValid ? undefined : reasons;

    const base = {
      ...validateNode(group),
      rules: children,
      valid: groupIsValid,
      invalidReason,
    };

    return base as RuleGroupType;
  };

  if (root.rules.length === 0) {
    return validateNode(root) as RuleGroupType;
  }

  const validatedRoot = validateGroup(root);

  return validatedRoot;
}
