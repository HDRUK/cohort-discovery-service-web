import { User } from "@/types/api";
import { filterUsers } from "../userFilters";

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 1,
    name: "Ada Lovelace",
    email: "ada@example.com",
    roles: [],
    custodians: [],
    workgroups: [],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }) as User;

const ADA = makeUser({
  id: 1,
  name: "Ada Lovelace",
  email: "ada@example.com",
  workgroups: [{ id: 10, name: "Analysts" }],
} as Partial<User>);

const GRACE = makeUser({
  id: 2,
  name: "Grace Hopper",
  email: "grace@example.com",
  workgroups: [{ id: 20, name: "Engineers" }],
} as Partial<User>);

const UNASSIGNED = makeUser({
  id: 3,
  name: "Alan Turing",
  email: "alan@example.com",
  workgroups: [],
} as Partial<User>);

const ALL = [ADA, GRACE, UNASSIGNED];

describe("filterUsers", () => {
  it("returns every user when no workgroup or search term is given", () => {
    expect(filterUsers(ALL, {})).toEqual(ALL);
  });

  it("returns every user when the workgroup filter is empty", () => {
    expect(filterUsers(ALL, { workgroupId: "" })).toEqual(ALL);
  });

  it("keeps only members of the requested workgroup", () => {
    expect(filterUsers(ALL, { workgroupId: "10" })).toEqual([ADA]);
  });

  it("matches a workgroup id given as a number-like string", () => {
    expect(filterUsers(ALL, { workgroupId: "20" })).toEqual([GRACE]);
  });

  it("excludes users belonging to no workgroup when one is requested", () => {
    expect(filterUsers(ALL, { workgroupId: "10" })).not.toContain(UNASSIGNED);
  });

  it("matches a search term against the name", () => {
    expect(filterUsers(ALL, { searchTerm: "grace" })).toEqual([GRACE]);
  });

  it("matches a search term against the email", () => {
    expect(filterUsers(ALL, { searchTerm: "alan@example" })).toEqual([
      UNASSIGNED,
    ]);
  });

  it("ignores case and surrounding whitespace in the search term", () => {
    expect(filterUsers(ALL, { searchTerm: "  LOVELACE " })).toEqual([ADA]);
  });

  it("applies the workgroup filter and the search term together", () => {
    expect(filterUsers(ALL, { workgroupId: "10", searchTerm: "grace" })).toEqual(
      [],
    );
  });

  it("returns nothing when the term matches no name or email", () => {
    expect(filterUsers(ALL, { searchTerm: "nobody" })).toEqual([]);
  });
});
