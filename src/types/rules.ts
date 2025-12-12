import { UniqueIdentifier } from "@dnd-kit/core";
import { Concept } from "./api";

export enum CombinatorType {
  AND = "and",
  OR = "or",
  FOLLOWED_BY = "followed_by",
}

export type ConceptOperator = {
  //ageConstraint: string;
  //valueConstraint: string;
  concept: Concept | null;
};

type Node = {
  id: string;
  exclude?: boolean;
  valid?: boolean;
  invalidReason?: string[];
  name?: string;
  timeConstraint?: [string | null, string | null];
  ageConstraint?: [number | null, number | null];
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

export interface AgeFilterType
  extends Omit<Node, "exclude" | "timeConstraint" | "ageConstraint"> {
  value: [number, number];
}

export type RuleNodeType =
  | RuleGroupType
  | RuleLeafType
  | OperatorType
  | AgeFilterType;

export interface BoardIndex {
  containers: string[];
  itemsByGroup: Record<string, string[]>;
}

export type SizeCache = Record<
  UniqueIdentifier,
  { width: number | string; height: number | string }
>;
