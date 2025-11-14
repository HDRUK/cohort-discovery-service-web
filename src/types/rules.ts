import { UniqueIdentifier } from "@dnd-kit/core";
import { Concept } from "./api";

export enum CombinatorType {
  AND = "and",
  OR = "or",
  FOLLOWED_BY = "followed_by",
}

export type ConceptOperator = {
  //ageConstraint: string;
  timeConstraint?: string;
  //valueConstraint: string;
  concept: Concept | Array<Concept> | null;
};

type Node = {
  id: string;
  exclude?: boolean;
  valid?: boolean;
  name?: string;
};

export interface OperatorType extends Node {
  combinator: CombinatorType;
}

export interface RuleGroupType extends Node {
  rules: Array<RuleNodeType>;
}

export interface RuleLeafType extends Node {
  rule: ConceptOperator;
}

export type RuleNodeType = RuleGroupType | RuleLeafType | OperatorType;

export interface BoardIndex {
  containers: string[];
  itemsByGroup: Record<string, string[]>;
}

export type SizeCache = Record<
  UniqueIdentifier,
  { width: number | string; height: number | string }
>;
