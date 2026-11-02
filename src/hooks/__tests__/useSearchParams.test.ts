import { act, renderHook } from "@testing-library/react";
import { createElement, Fragment } from "react";
import {
  SearchParamsTransitionProvider,
  useSearchParamsTransition,
} from "@/contexts/SearchParamsTransitionContext";
import { createPendingNavigation } from "@/utils/pendingNavigation";
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

    act(() => setSearchParam(""));

    expect(mockReplace).toHaveBeenCalledWith(mockPathname);
  });

  it("keeps the remaining params as a relative query", () => {
    const { setSearchParams } = setup("page=2");

    act(() => setSearchParams({ search_term: "abc" }));

    expect(mockReplace).toHaveBeenCalledWith("?page=2&search_term=abc");
  });
});

describe("while a navigation is pending", () => {
  const navigation = createPendingNavigation();

  const renderWithRouter = (query: string, wrapper = Fragment) => {
    mockSearchParams = new URLSearchParams(query);
    mockReplace.mockImplementationOnce(() => navigation.start());
    return renderHook(
      () => ({
        ...useSearchParams("search_term"),
        isPending: useSearchParamsTransition().isPending,
      }),
      {
        wrapper: ({ children }) =>
          createElement(
            wrapper,
            null,
            children,
            createElement(navigation.PendingRouter),
          ),
      },
    );
  };

  it("reads the new value straight away, before the URL has updated", async () => {
    const { result } = renderWithRouter("search_term=old");

    await act(async () => result.current.setSearchParam("new"));

    expect(result.current.getSearchParam()).toBe("new");
  });

  it("goes back to the URL value once the navigation finishes", async () => {
    const { result } = renderWithRouter("search_term=old");
    await act(async () => result.current.setSearchParam("new"));

    mockSearchParams = new URLSearchParams("search_term=committed");
    await act(async () => navigation.finish());

    expect(result.current.getSearchParam()).toBe("committed");
  });

  it("reports pending through the provider until the navigation finishes", async () => {
    const { result } = renderWithRouter(
      "search_term=old",
      SearchParamsTransitionProvider,
    );

    await act(async () => result.current.setSearchParam("new"));

    expect(result.current.isPending).toBe(true);

    await act(async () => navigation.finish());

    expect(result.current.isPending).toBe(false);
  });
});
