import { UniqueIdentifier } from "@dnd-kit/core";
import { Concept } from "./api";

export enum CombinatorType {
  AND = "and",
  OR = "or",
  FOLLOWED_BY = "followed_by",
}

export type ConceptOperator = {
  //operator: string;
  //ageConstraint: string;
  //timeConstraint: string;
  //valueConstraint: string;
  concept: Concept | Array<Concept> | null;
};

export type OperatorType = {
  id: string;
  combinator: CombinatorType;
  valid?: boolean;
};

export type RuleGroupType = {
  id: string;
  rules: Array<RuleNodeType>;
  exclude?: boolean;
  valid?: boolean;
};

export type RuleLeafType = {
  id: string;
  rule: ConceptOperator;
  exclude?: boolean;
  valid?: boolean;
};

export type RuleNodeType = RuleGroupType | RuleLeafType | OperatorType;

export interface BoardIndex {
  containers: string[];
  itemsByContainer: Record<string, string[]>;
}

export type SizeCache = Record<
  UniqueIdentifier,
  { width: number | string; height: number | string }
>;
