import { UniqueIdentifier } from "@dnd-kit/core";
import { Concept } from "./api";

export enum CombinatorType {
  AND = "and",
  OR = "or",
  FOLLOWED_BY = "followed_by",
}

export enum SingleSidedOperator {
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
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
  warnings?: string[];
  name?: string;
  timeConstraint?: [string | null, string | null];
  timeConstraintOperator?: SingleSidedOperator;
  ageConstraint?: [number | null, number | null];
  ageConstraintOperator?: SingleSidedOperator;
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

export interface DemographicFilterType extends Omit<
  Node,
  "exclude" | "timeConstraint" | "ageConstraint"
> {
  value: [number, number];
  deceased?: boolean;
}

export type RuleNodeType =
  | RuleGroupType
  | RuleLeafType
  | OperatorType
  | DemographicFilterType;

export interface BoardIndex {
  containers: string[];
  itemsByGroup: Record<string, string[]>;
}

export type SizeCache = Record<
  UniqueIdentifier,
  { width: number | string; height: number | string }
>;
