import { selectAllById, selectById, selectByIdOrFirst } from "../selection";

const items = [
  { id: 1, name: "First" },
  { id: 2, name: "Second" },
];

describe("selectById", () => {
  it("finds the item with the string id", () => {
    expect(selectById(items, "2")).toEqual(items[1]);
  });

  it("returns null for a missing id", () => {
    expect(selectById(items, "3")).toBeNull();
    expect(selectById(items, null)).toBeNull();
  });
});

describe("selectByIdOrFirst", () => {
  it("falls back to the first item when nothing matches", () => {
    expect(selectByIdOrFirst(items, null)).toEqual(items[0]);
  });

  it("returns null for an empty list", () => {
    expect(selectByIdOrFirst([], "1")).toBeNull();
  });
});

describe("selectAllById", () => {
  it("keeps the order of the ids and drops missing ones", () => {
    expect(selectAllById(items, ["2", "9", "1"])).toEqual([items[1], items[0]]);
  });
});
