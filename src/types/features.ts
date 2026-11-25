import type { FEATURE_FLAGS } from "@/config/featureFlags";

type FeatureFlags = typeof FEATURE_FLAGS;

export type FeatureName = {
  [K in keyof FeatureFlags]: FeatureFlags[K] extends { default: boolean }
    ? K
    : never;
}[keyof FeatureFlags];

export type FeatureFlag = Record<FeatureName, boolean>;

export interface FeatureOverride {
  id: number;
  name: string;
  email?: string;
  enabled: boolean;
}

export interface FeatureOverrides {
  feature: string;
  global: boolean;
  overridable?: boolean;
  users: FeatureOverride[];
  workgroups: FeatureOverride[];
}

export interface FeatureOverrideUpdate {
  id: number;
  enabled: boolean;
}

export interface FeatureOverridesUpdate {
  users: FeatureOverrideUpdate[];
  workgroups: FeatureOverrideUpdate[];
}

export interface OverrideRule {
  enabled: boolean;
  workgroups: number[];
  users: number[];
}

export type RuleSubject = "workgroups" | "users";
