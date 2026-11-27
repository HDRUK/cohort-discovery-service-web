import { diffMembership } from "../membership";

describe("diffMembership", () => {
  it("adds only ids that are not already members", () => {
    expect(diffMembership([1, 2], [1, 2, 3]).added).toEqual([3]);
  });

  it("removes members that are no longer selected", () => {
    expect(diffMembership([1, 2, 3], [1]).removed).toEqual([2, 3]);
  });

  it("changes nothing when the selection matches the members", () => {
    expect(diffMembership([2, 1], [1, 2])).toEqual({ added: [], removed: [] });
  });
});
