import { Query } from "@/types/api";
import {
  buildDashboardTabs,
  parseOpenQueries,
  resultPidFrom,
  resultTabLabel,
} from "./dashboardTabs";

const labelFor = (pid: string) => `Result: ${pid}`;

describe("parseOpenQueries", () => {
  it("splits the open query pids", () => {
    expect(parseOpenQueries("a,b")).toEqual(["a", "b"]);
  });

  it("returns no pids for a missing or empty param", () => {
    expect(parseOpenQueries(null)).toEqual([]);
    expect(parseOpenQueries("")).toEqual([]);
  });
});

describe("resultPidFrom", () => {
  it("reads the pid from a result tab id", () => {
    expect(resultPidFrom("query-result-abc")).toBe("abc");
  });

  it("rejects any other tab id", () => {
    expect(resultPidFrom("collections")).toBeNull();
    expect(resultPidFrom("query-result-")).toBeNull();
  });
});

describe("resultTabLabel", () => {
  it("falls back to the pid while the query loads", () => {
    expect(resultTabLabel(undefined, "abc")).toBe("Result: abc");
  });

  it("uses the query name once it has loaded", () => {
    expect(
      resultTabLabel({ name: "Diabetes cohort" } as Query, "abc").trim(),
    ).toBe("Result: Diabetes cohort");
  });
});

describe("buildDashboardTabs", () => {
  it("always has the new query and history tabs", () => {
    expect(buildDashboardTabs([], labelFor).map((tab) => tab.id)).toEqual([
      "new-query",
      "query-history",
    ]);
  });

  it("adds a closable tab per open query that keeps the others open", () => {
    const [, , first] = buildDashboardTabs(["a", "b"], labelFor);

    expect(first).toEqual({
      id: "query-result-a",
      label: "Result: a",
      href: "/dashboard/query-result-a?query=a&open_queries=a,b",
      onCloseHref: "/dashboard/new-query?open_queries=b",
    });
  });
});
