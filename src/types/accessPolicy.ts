export enum MembershipSubject {
  Workgroups = "workgroups",
  Roles = "roles",
  Custodians = "custodians",
}

export enum MembershipMode {
  Internal = "internal",
  FirstLogin = "first_login",
  Additive = "additive",
  Authoritative = "authoritative",
}

export enum RestoredWhen {
  EverySync = "every_sync",
  SdeApproved = "sde_approved",
}

export interface RestoredEntry {
  id: number;
  name: string;
  when: RestoredWhen;
}

export interface SubjectPolicy {
  mode: MembershipMode;
  authoritative: boolean;
  editable: boolean;
  restored_on_sync: RestoredEntry[];
}

export interface AccessPolicy {
  operation_mode: string;
  providers: Record<string, string>;
  [MembershipSubject.Workgroups]: SubjectPolicy;
  [MembershipSubject.Roles]: SubjectPolicy;
  [MembershipSubject.Custodians]: SubjectPolicy;
}

export interface UserMembershipSource {
  mode: MembershipMode;
  editable: boolean;
  sources: string[];
}

export type MembershipSources = Record<MembershipSubject, UserMembershipSource>;
