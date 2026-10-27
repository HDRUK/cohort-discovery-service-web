import { renderHook } from "@testing-library/react";
import useSearchParams from "../useSearchParams";

const mockPathname = "/admin/collections";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
  }),
}));

const setup = (query: string) => {
  mockReplace.mockClear();
  mockSearchParams = new URLSearchParams(query);
  return renderHook(() => useSearchParams("search_term")).result.current;
};

describe("setSearchParams", () => {
  it("replaces with the pathname when the last param is cleared", () => {
    const { setSearchParam } = setup("search_term=a");

    setSearchParam("");

    expect(mockReplace).toHaveBeenCalledWith(mockPathname);
  });

  it("keeps the remaining params as a relative query", () => {
    const { setSearchParams } = setup("page=2");

    setSearchParams({ search_term: "abc" });

    expect(mockReplace).toHaveBeenCalledWith("?page=2&search_term=abc");
  });
});
