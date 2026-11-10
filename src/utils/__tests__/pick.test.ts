import { pick } from "../pick";

interface Network {
  name: string;
  url: string;
  custodian_id?: number;
}

const network = (overrides: Partial<Network> = {}): Network => ({
  name: "North network",
  url: "https://example.com",
  ...overrides,
});

describe("pick", () => {
  it("keeps only the named keys", () => {
    const crafted = { ...network(), is_admin: true } as Network;

    expect(pick(crafted, ["name", "url"])).toEqual({
      name: "North network",
      url: "https://example.com",
    });
  });

  it("leaves out named keys the value doesn't have", () => {
    expect(pick(network(), ["name", "custodian_id"])).toEqual({
      name: "North network",
    });
  });

  it("ignores keys inherited from the prototype", () => {
    const crafted = Object.create({ name: "inherited" }) as Network;

    expect(pick(crafted, ["name"])).toEqual({});
  });
});
