import {
  assignColourSlots,
  fromSlotList,
  MAX_PLOTTED_COLLECTIONS,
  plottablePids,
  toSlotList,
} from "../seriesColours";

describe("assignColourSlots", () => {
  it("hands out the lowest free slots in selection order", () => {
    expect(assignColourSlots({}, ["a", "b", "c"])).toEqual({
      a: 0,
      b: 1,
      c: 2,
    });
  });

  it("leaves every survivor's slot untouched when one is deselected", () => {
    const before = assignColourSlots({}, ["a", "b", "c"]);
    const after = assignColourSlots(before, ["a", "c"]);

    expect(after).toEqual({ a: 0, c: 2 });
  });

  it("reuses the freed slot for the next collection added", () => {
    const before = assignColourSlots({}, ["a", "b", "c"]);
    const without = assignColourSlots(before, ["a", "c"]);
    const after = assignColourSlots(without, ["a", "c", "d"]);

    expect(after).toEqual({ a: 0, c: 2, d: 1 });
  });

  it("keeps a collection's colour across an unrelated addition", () => {
    const before = assignColourSlots({}, ["a"]);
    const after = assignColourSlots(before, ["a", "b"]);

    expect(after.a).toBe(before.a);
  });

  it("refuses to plot more than the ceiling allows", () => {
    const many = Array.from({ length: 12 }, (_, index) => `pid-${index}`);
    const assignment = assignColourSlots({}, many);

    expect(Object.keys(assignment)).toHaveLength(MAX_PLOTTED_COLLECTIONS);
    expect(new Set(Object.values(assignment)).size).toBe(
      MAX_PLOTTED_COLLECTIONS,
    );
  });

  it("never gives two collections the same slot", () => {
    const first = assignColourSlots({}, ["a", "b", "c", "d"]);
    const second = assignColourSlots(first, ["b", "d", "e", "f"]);
    const slots = Object.values(second);

    expect(new Set(slots).size).toBe(slots.length);
  });

  it("dedupes a selection that names the same collection twice", () => {
    expect(assignColourSlots({}, ["a", "a", "b"])).toEqual({ a: 0, b: 1 });
  });

  it("drops a stale slot that sits beyond a smaller ceiling", () => {
    expect(assignColourSlots({ a: 5 }, ["a"], 3)).toEqual({ a: 0 });
  });

  it("returns nothing for an empty selection", () => {
    expect(assignColourSlots({ a: 0 }, [])).toEqual({});
  });
});

describe("plottablePids", () => {
  it("orders pids by their slot so colours stay in palette order", () => {
    expect(plottablePids({ c: 2, a: 0, b: 1 })).toEqual(["a", "b", "c"]);
  });
});

describe("toSlotList / fromSlotList", () => {
  it("round-trips an assignment through the URL form", () => {
    const assignment = assignColourSlots({}, ["a", "b", "c"]);

    expect(fromSlotList(toSlotList(assignment))).toEqual(assignment);
  });

  it("keeps a freed slot as a hole so survivors keep their colour", () => {
    const before = assignColourSlots({}, ["a", "b", "c"]);
    const after = assignColourSlots(before, ["a", "c"]);

    expect(toSlotList(after)).toEqual(["a", "", "c"]);
    expect(fromSlotList(["a", "", "c"])).toEqual({ a: 0, c: 2 });
  });

  it("trims trailing holes rather than padding the param", () => {
    expect(toSlotList({ a: 0 })).toEqual(["a"]);
  });

  it("reads an empty param as nothing selected", () => {
    expect(fromSlotList("".split(","))).toEqual({});
  });

  it("survives a hand-edited param with a leading hole", () => {
    expect(fromSlotList(["", "b"])).toEqual({ b: 1 });
  });
});
