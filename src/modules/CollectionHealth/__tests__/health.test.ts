import {
  CollectionMetadata,
  CollectionWithHosts,
  RegressionTest,
  ResultFile,
  Task,
} from "@/types/api";
import {
  buildCollectionHealth,
  formatAge,
  getCheck,
  PING_OK_MS,
  PING_WARN_MS,
  regressionCheckId,
  SCAN_STALE_MS,
} from "../health";

const NOW = new Date("2026-09-01T12:00:00Z").getTime();

const isoAgo = (ms: number) => new Date(NOW - ms).toISOString();

const activity = (ms: number) => ({
  id: 1,
  collection_id: 1,
  task_type: "a",
  created_at: isoAgo(ms),
  updated_at: isoAgo(ms),
});

const resultFile = (ms: number, status = "done"): ResultFile =>
  ({
    id: 1,
    status,
    file_description: "",
    rows_processed: 42,
    created_at: isoAgo(ms),
    updated_at: isoAgo(ms),
  }) as ResultFile;

const metadata = (ms: number): CollectionMetadata => ({
  created_at: isoAgo(ms),
  os: null,
  bclink: "1.4.2",
  biobank: "test",
  datamodel: "OMOP",
  protocol: "Bunny",
  rounding: "0",
  threshold: "0",
});

const successfulQuery = (ms: number): Task =>
  ({
    pid: "task-pid",
    created_at: isoAgo(ms),
    completed_at: isoAgo(ms),
    result: { count: 0 },
  }) as Task;

const COLLECTION_PID = "collection-pid";

const buildCollection = (
  overrides: Partial<CollectionWithHosts> = {},
): CollectionWithHosts =>
  ({
    pid: COLLECTION_PID,
    name: "Test Collection",
    type: "bunny",
    url: "https://example.com",
    created_at: isoAgo(0),
    custodian: { name: "Test Custodian" },
    model_state: { state: { slug: "active" } },
    last_ping: { a: activity(1000), b: activity(1000) },
    last_successful_query: successfulQuery(60_000),
    latest_successful_concept_result_file: resultFile(60_000),
    latest_successful_demographic_result_file: resultFile(60_000),
    latest_metadata: metadata(60_000),
    ...overrides,
  }) as CollectionWithHosts;

const buildTest = (
  pid: string,
  name: string,
  collections: {
    pid: string;
    last_passed: boolean | null;
    expected_result?: number | null;
    count?: number;
  }[],
): RegressionTest =>
  ({
    pid,
    name,
    collections: collections.map((collection) => ({
      pid: collection.pid,
      name: collection.pid,
      expected_result:
        collection.expected_result === undefined
          ? 100
          : collection.expected_result,
      run_count: 1,
      last_run_at: isoAgo(1000),
      pass_rate: 100,
      last_passed: collection.last_passed,
      tasks:
        collection.count === undefined
          ? []
          : [
              {
                pid: "t",
                created_at: isoAgo(1000),
                completed_at: isoAgo(1000),
                failed_at: null,
                result: { count: collection.count, status: "ok" },
              },
            ],
    })),
  }) as RegressionTest;

const health = (
  overrides: Partial<CollectionWithHosts> = {},
  tests: RegressionTest[] = [],
) => buildCollectionHealth(buildCollection(overrides), tests, NOW);

describe("formatAge", () => {
  it.each([
    [5_000, "5s"],
    [90_000, "1m"],
    [2 * 60 * 60 * 1000, "2h"],
    [3 * 24 * 60 * 60 * 1000, "3d"],
  ])("formats %ims as %s", (ms, expected) => {
    expect(formatAge(isoAgo(ms), NOW)).toBe(expected);
  });

  it("returns 'never' for a missing or invalid date", () => {
    expect(formatAge(null, NOW)).toBe("never");
    expect(formatAge("not-a-date", NOW)).toBe("never");
  });
});

describe("ping checks", () => {
  it("is ok inside the 2 minute window", () => {
    const row = health({
      last_ping: { a: activity(PING_OK_MS - 1000), b: activity(1000) },
    });
    expect(getCheck(row, "ping_a")?.level).toBe("ok");
  });

  it("warns between 2 and 30 minutes", () => {
    const row = health({
      last_ping: { a: activity(PING_OK_MS + 1000), b: activity(1000) },
    });
    expect(getCheck(row, "ping_a")?.level).toBe("warn");
  });

  it("fails beyond 30 minutes, the point the API auto-suspends", () => {
    const row = health({
      last_ping: { a: activity(PING_WARN_MS + 1000), b: activity(1000) },
    });
    expect(getCheck(row, "ping_a")?.level).toBe("fail");
    expect(row.overall.label).toBe("Offline");
  });

  it("fails and reports 'never' when a bunny has never polled", () => {
    const row = health({ last_ping: { a: null, b: activity(1000) } });
    expect(getCheck(row, "ping_a")).toMatchObject({
      level: "fail",
      value: "never",
    });
  });

  it("tracks the B-type ping independently of the A-type ping", () => {
    const row = health({
      last_ping: { a: activity(1000), b: activity(PING_WARN_MS + 1000) },
    });
    expect(getCheck(row, "ping_a")?.level).toBe("ok");
    expect(getCheck(row, "ping_b")?.level).toBe("fail");
  });

  it("formats the ping timestamp rather than showing a raw ISO string", () => {
    expect(getCheck(health(), "ping_a")?.detail).toMatch(
      /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/,
    );
  });
});

describe("stage 2 data checks", () => {
  it("treats an obfuscated zero count as a successful cohort query", () => {
    const check = getCheck(health(), "cohort_query");
    expect(check?.level).toBe("ok");
    expect(check?.detail).toContain("obfuscated");
  });

  it("fails when no cohort query has ever succeeded", () => {
    expect(getCheck(health({ last_successful_query: null }), "cohort_query")
      ?.level).toBe("fail");
  });

  it("warns when a scan file arrived but post-processing did not finish", () => {
    const row = health({
      latest_successful_concept_result_file: resultFile(60_000, "failed"),
    });
    expect(getCheck(row, "concept_scan")?.level).toBe("warn");
  });

  it("warns when a scan is older than 30 days", () => {
    const row = health({
      latest_successful_demographic_result_file: resultFile(
        SCAN_STALE_MS + 1000,
      ),
    });
    expect(getCheck(row, "demographics_scan")?.level).toBe("warn");
  });

  it("surfaces the BUNNY version from metadata", () => {
    const row = health();
    expect(getCheck(row, "metadata")?.value).toBe("1.4.2");
    expect(row.bunnyVersion).toBe("1.4.2");
  });

  it("fails when no metadata has ever been received", () => {
    expect(getCheck(health({ latest_metadata: null }), "metadata")?.level).toBe(
      "fail",
    );
  });
});

describe("collection detail", () => {
  it("exposes the pid and formatted creation date for the detail panel", () => {
    const row = health();
    expect(row.pid).toBe(COLLECTION_PID);
    expect(row.stateSlug).toBe("active");
    expect(row.contextType).toBe("bunny");
    expect(row.createdAt).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("stage 3 health check columns", () => {
  it("produces one check per configured test, in test order", () => {
    const row = health({}, [
      buildTest("test-a", "Basic cohort", [
        { pid: COLLECTION_PID, last_passed: true, count: 100 },
      ]),
      buildTest("test-b", "Complex cohort", [
        { pid: COLLECTION_PID, last_passed: false, count: 55 },
      ]),
    ]);

    const stage3 = row.checks.filter((check) => check.stage === 3);
    expect(stage3.map((check) => check.label)).toEqual([
      "Basic cohort",
      "Complex cohort",
    ]);
    expect(stage3.map((check) => check.id)).toEqual([
      regressionCheckId("test-a"),
      regressionCheckId("test-b"),
    ]);
  });

  it("shows the actual count and passes when the test passed", () => {
    const row = health({}, [
      buildTest("test-a", "Basic cohort", [
        { pid: COLLECTION_PID, last_passed: true, count: 1234 },
      ]),
    ]);
    expect(getCheck(row, regressionCheckId("test-a"))).toMatchObject({
      level: "ok",
      value: "1,234",
      expected: 100,
      linked: true,
    });
  });

  it("fails and reports expected versus actual when the test failed", () => {
    const row = health({}, [
      buildTest("test-a", "Basic cohort", [
        {
          pid: COLLECTION_PID,
          last_passed: false,
          count: 55,
          expected_result: 100,
        },
      ]),
    ]);
    const check = getCheck(row, regressionCheckId("test-a"));
    expect(check?.level).toBe("fail");
    expect(check?.detail).toContain("Expected 100, got 55");
    expect(row.overall).toMatchObject({ level: "fail", label: "Failing" });
  });

  it("marks a collection not linked to a test as neutral, not unhealthy", () => {
    const row = health({}, [
      buildTest("test-a", "Basic cohort", [
        { pid: "some-other-collection", last_passed: true },
      ]),
    ]);
    expect(getCheck(row, regressionCheckId("test-a"))).toMatchObject({
      level: "none",
      value: "—",
      linked: false,
    });
    expect(row.overall.label).toBe("Live");
    expect(row.regressionTestPids).toEqual([]);
  });

  it("flags a linked test with no expected result as unable to pass", () => {
    const row = health({}, [
      buildTest("test-a", "Basic cohort", [
        { pid: COLLECTION_PID, last_passed: null, expected_result: null },
      ]),
    ]);
    const check = getCheck(row, regressionCheckId("test-a"));
    expect(check).toMatchObject({ level: "none", value: "never" });
    expect(check?.detail).toContain("can never pass");
  });

  it("lists linked test pids so the run action knows what to trigger", () => {
    const row = health({}, [
      buildTest("test-a", "A", [{ pid: COLLECTION_PID, last_passed: true }]),
      buildTest("test-b", "B", [{ pid: "other", last_passed: true }]),
      buildTest("test-c", "C", [{ pid: COLLECTION_PID, last_passed: null }]),
    ]);
    expect(row.regressionTestPids).toEqual(["test-a", "test-c"]);
  });

  it("stays Live when every stage 1 and 2 check is healthy and no checks exist", () => {
    expect(health().overall).toMatchObject({ level: "ok", label: "Live" });
  });
});
