/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const forwardedHeader = (response: Response, name: string) =>
  response.headers.get(`x-middleware-request-${name}`);

describe("proxy", () => {
  afterEach(() => jest.restoreAllMocks());

  it("forwards x-request-now on the request", async () => {
    jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_500);

    const response = await proxy(new NextRequest("https://localhost/admin"));

    expect(forwardedHeader(response, "x-request-now")).toBe("1700000000");
    expect(response.headers.get("x-request-now")).toBeNull();
  });

  it("forwards x-pathname with the query string", async () => {
    const response = await proxy(
      new NextRequest("https://localhost/term-directory?tab=conditions"),
    );

    expect(forwardedHeader(response, "x-pathname")).toBe(
      "/term-directory?tab=conditions",
    );
  });
});
