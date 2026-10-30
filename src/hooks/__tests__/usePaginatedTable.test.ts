import { act, renderHook } from "@testing-library/react";
import { MRT_ColumnDef, MRT_TableOptions } from "material-react-table";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { buildRowsPerPageOptions } from "@/utils/pagination";
import { usePaginatedTable } from "../usePaginatedTable";
import { useTable } from "../useTable";

interface Row {
  pid?: string;
  id?: number;
  name: string;
}

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
  }),
}));

jest.mock("../useTable");

const mockUseTable = useTable as jest.MockedFunction<typeof useTable>;

const COLUMNS: MRT_ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }];
const ROW_WITH_PID: Row = { pid: "abc", id: 7, name: "With pid" };
const ROW_WITH_ID: Row = { id: 7, name: "With id" };
const ROW_WITH_NEITHER: Row = { name: "With neither" };
const ROWS = [ROW_WITH_PID, ROW_WITH_ID];
const PER_PAGE_DEFAULT = 10;

type SetupOptions = Partial<Parameters<typeof usePaginatedTable<Row>>[0]>;

const lastOptions = (): MRT_TableOptions<Row> =>
  mockUseTable.mock.calls[mockUseTable.mock.calls.length - 1][0];

const setup = (query = "", options: SetupOptions = {}) => {
  mockSearchParams = new URLSearchParams(query);
  mockUseTable.mockReturnValue({} as ReturnType<typeof useTable<Row>>);
  return renderHook(() =>
    usePaginatedTable<Row>({
      columns: COLUMNS,
      data: ROWS,
      rowCount: 42,
      perPageDefault: PER_PAGE_DEFAULT,
      ...options,
    }),
  );
};

describe("pagination state", () => {
  it("starts on the first page at the default page size", () => {
    setup();

    expect(lastOptions().state?.pagination).toEqual({
      pageIndex: 0,
      pageSize: PER_PAGE_DEFAULT,
    });
  });

  it("reads the page and page size from the url", () => {
    setup("page=3&per_page=50");

    expect(lastOptions().state?.pagination).toEqual({
      pageIndex: 2,
      pageSize: 50,
    });
  });

  it("reads custom param names", () => {
    setup("p=4&size=20", { pageParam: "p", perPageParam: "size" });

    expect(lastOptions().state?.pagination).toEqual({
      pageIndex: 3,
      pageSize: 20,
    });
  });

  it.each([0, -5])(
    "falls back to the global default page size when perPageDefault is %i",
    (perPageDefault) => {
      setup("", { perPageDefault });

      expect(lastOptions().state?.pagination?.pageSize).toBe(DEFAULT_PER_PAGE);
    },
  );

  it("builds the page size options from the resolved default", () => {
    setup();

    expect(lastOptions().muiPaginationProps).toEqual({
      rowsPerPageOptions: buildRowsPerPageOptions(PER_PAGE_DEFAULT),
    });
  });
});

describe("onPaginationChange", () => {
  it("writes a new pagination value to the url", () => {
    setup();

    lastOptions().onPaginationChange?.({ pageIndex: 2, pageSize: 50 });

    expect(mockReplace).toHaveBeenCalledWith("?page=3&per_page=50");
  });

  it("passes the current pagination to an updater function", () => {
    setup("page=2&per_page=20");

    lastOptions().onPaginationChange?.((current) => ({
      ...current,
      pageIndex: current.pageIndex + 1,
    }));

    expect(mockReplace).toHaveBeenCalledWith("?page=3&per_page=20");
  });

  it("keeps unrelated params", () => {
    setup("search_term=abc&page=1");

    lastOptions().onPaginationChange?.({ pageIndex: 1, pageSize: 25 });

    expect(mockReplace).toHaveBeenCalledWith(
      "?search_term=abc&page=2&per_page=25",
    );
  });

  it("writes to custom param names", () => {
    setup("", { pageParam: "p", perPageParam: "size" });

    lastOptions().onPaginationChange?.({ pageIndex: 1, pageSize: 25 });

    expect(mockReplace).toHaveBeenCalledWith("?p=2&size=25");
  });
});

describe("options passed to useTable", () => {
  it("enables manual pagination and sorting", () => {
    setup();

    expect(lastOptions()).toMatchObject({
      enablePagination: true,
      manualPagination: true,
      enableSorting: true,
    });
  });

  it("forwards columns, data and rowCount", () => {
    setup();

    expect(lastOptions()).toMatchObject({
      columns: COLUMNS,
      data: ROWS,
      rowCount: 42,
    });
  });

  it("merges caller state over the pagination and sorting state", () => {
    setup("page=2", {
      state: { isLoading: true, sorting: [{ id: "name", desc: true }] },
    });

    expect(lastOptions().state).toEqual({
      pagination: { pageIndex: 1, pageSize: PER_PAGE_DEFAULT },
      sorting: [{ id: "name", desc: true }],
      isLoading: true,
    });
  });

  it("lets caller options override the defaults", () => {
    setup("", { enableSorting: false, enableRowSelection: false });

    expect(lastOptions()).toMatchObject({
      enableSorting: false,
      enableRowSelection: false,
    });
  });

  it("starts unsorted and tracks sorting changes", () => {
    const { rerender } = setup();
    expect(lastOptions().state?.sorting).toEqual([]);

    act(() => {
      lastOptions().onSortingChange?.([{ id: "name", desc: false }]);
    });
    rerender();

    expect(lastOptions().state?.sorting).toEqual([{ id: "name", desc: false }]);
  });
});

describe("getRowId", () => {
  it("prefers the pid", () => {
    setup();

    expect(lastOptions().getRowId?.(ROW_WITH_PID, 0)).toBe("abc");
  });

  it("falls back to the id", () => {
    setup();

    expect(lastOptions().getRowId?.(ROW_WITH_ID, 0)).toBe("7");
  });

  it("falls back to an empty string", () => {
    setup();

    expect(lastOptions().getRowId?.(ROW_WITH_NEITHER, 0)).toBe("");
  });

  it("uses a caller supplied getRowId", () => {
    setup("", { getRowId: (row) => row.name });

    expect(lastOptions().getRowId?.(ROW_WITH_PID, 0)).toBe("With pid");
  });
});

describe("expandFirstRow", () => {
  it("expands the first row when enabled", () => {
    setup("", { expandFirstRow: true });

    expect(lastOptions().initialState?.expanded).toEqual({ abc: true });
  });

  it("expands nothing by default", () => {
    setup();

    expect(lastOptions().initialState?.expanded).toEqual({});
  });

  it("expands nothing when there is no data", () => {
    setup("", { data: [], expandFirstRow: true });

    expect(lastOptions().initialState?.expanded).toEqual({});
  });

  it("keeps the caller's initial state", () => {
    setup("", {
      expandFirstRow: true,
      initialState: { columnVisibility: { name: false } },
    });

    expect(lastOptions().initialState).toEqual({
      columnVisibility: { name: false },
      expanded: { abc: true },
    });
  });
});
