/**
 * @jest-environment node
 */
import { GET } from "../route";

const call = (region: string) =>
  GET(new Request("http://localhost"), { params: Promise.resolve({ region }) });

describe("GET /api/location/boundaries/[region]", () => {
  // Cloud Run rejects HTTP/1 responses over 32 MiB that declare a
  // Content-Length; streamed (chunked) responses are exempt. LSOA is ~35 MiB.
  it("streams LSOA without a fixed Content-Length", async () => {
    const res = await call("lsoa");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Length")).toBeNull();
    await res.body?.cancel(); // don't read 35 MiB in a test
  });

  it("returns 404 for an unknown region", async () => {
    expect((await call("nope")).status).toBe(404);
  });
});
