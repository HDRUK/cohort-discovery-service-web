import { AuthMethod } from "@/types/api";

export type OidcAuthMethod = Extract<AuthMethod, { type: "oidc" }>;
export type PasswordAuthMethod = Extract<AuthMethod, { type: "password" }>;

export interface PartitionedAuthMethods {
  passwordMethod?: PasswordAuthMethod;
  providers: OidcAuthMethod[];
}

export const partitionAuthMethods = (
  methods: AuthMethod[] = [],
): PartitionedAuthMethods => ({
  passwordMethod: methods.find(
    (method): method is PasswordAuthMethod => method.type === "password",
  ),
  providers: methods.filter(
    (method): method is OidcAuthMethod => method.type === "oidc",
  ),
});
