import dayjs from "dayjs";
import {
  Activity,
  CollectionMetadata,
  CollectionWithHosts,
  RegressionTest,
  ResultFile,
  Task,
} from "@/types/api";
import { getDatetime } from "@/utils/date";

export type HealthLevel = "ok" | "warn" | "fail" | "none";

export type HealthStage = 1 | 2 | 3;

export interface HealthCheck {
  id: string;
  label: string;
  stage: HealthStage;
  level: HealthLevel;
  value: string;
  detail: string;
  // Stage 3 only — lets the detail panel edit the expected result inline.
  testPid?: string;
  expected?: number | null;
  linked?: boolean;
}

export interface CollectionHealthRow {
  pid: string;
  name: string;
  custodianName: string;
  isSynthetic: boolean;
  stateSlug: string;
  contextType: string;
  url: string | null;
  createdAt: string;
  bunnyVersion: string | null;
  checks: HealthCheck[];
  overall: { level: HealthLevel; label: string };
  regressionTestPids: string[];
}

// BUNNY polls every POLLING_INTERVAL (default 5s) and backs off to a 60s cap on
// error, so anything under two minutes is healthy. Thirty minutes is
// COLLECTION_INACTIVITY_MINUTES, the point at which the API auto-suspends.
export const PING_OK_MS = 2 * 60 * 1000;
export const PING_WARN_MS = 30 * 60 * 1000;

// Distribution scans are scheduled weekly at their most frequent, so a scan
// older than 30 days means the schedule has stopped firing.
export const SCAN_STALE_MS = 30 * 24 * 60 * 60 * 1000;

export const REGRESSION_CHECK_PREFIX = "regression:";

export const regressionCheckId = (testPid: string) =>
  `${REGRESSION_CHECK_PREFIX}${testPid}`;

export const formatAge = (
  date?: string | null,
  now: number = Date.now(),
): string => {
  if (!date) return "never";

  const parsed = dayjs(date);
  if (!parsed.isValid()) return "never";

  const ms = now - parsed.valueOf();
  if (ms < 0) return "now";

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
};

const ageMs = (
  date?: string | null,
  now: number = Date.now(),
): number | null => {
  if (!date) return null;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return null;

  return now - parsed.valueOf();
};

const buildPingCheck = (
  id: string,
  label: string,
  activity: Activity | null | undefined,
  now: number,
): HealthCheck => {
  const age = ageMs(activity?.updated_at, now);

  if (age === null) {
    return {
      id,
      label,
      stage: 1,
      level: "fail",
      value: "never",
      detail: `No ${label} has ever polled this collection.`,
    };
  }

  const level: HealthLevel =
    age <= PING_OK_MS ? "ok" : age <= PING_WARN_MS ? "warn" : "fail";

  return {
    id,
    label,
    stage: 1,
    level,
    value: formatAge(activity?.updated_at, now),
    detail: `Last polled ${getDatetime(activity?.updated_at)} (${formatAge(activity?.updated_at, now)} ago).`,
  };
};

const buildCohortQueryCheck = (
  task: Task | null | undefined,
  now: number,
): HealthCheck => {
  if (!task) {
    return {
      id: "cohort_query",
      label: "Cohort query",
      stage: 2,
      level: "fail",
      value: "never",
      detail:
        "No A-type cohort query has ever completed successfully against this collection.",
    };
  }

  const when = task.completed_at ?? task.created_at;

  return {
    id: "cohort_query",
    label: "Cohort query",
    stage: 2,
    level: "ok",
    value: formatAge(when, now),
    detail: `Last successful A-type query ${getDatetime(when ?? undefined)} (${formatAge(when, now)} ago). Task ${task.pid}. Result count ${task.result?.count ?? "unknown"} — counts are obfuscated, so 0 does not imply failure.`,
  };
};

const buildScanCheck = (
  id: string,
  label: string,
  file: ResultFile | null | undefined,
  now: number,
): HealthCheck => {
  if (!file) {
    return {
      id,
      label,
      stage: 2,
      level: "fail",
      value: "never",
      detail: `No successful ${label.toLowerCase()} has ever been returned by a B-type job.`,
    };
  }

  const age = ageMs(file.created_at, now);
  const isStale = age !== null && age > SCAN_STALE_MS;
  const isProcessed = file.status === "done";

  const level: HealthLevel = !isProcessed ? "warn" : isStale ? "warn" : "ok";

  const reason = !isProcessed
    ? ` File post-processing status is "${file.status}", not "done".`
    : isStale
      ? " Older than 30 days — the scheduled distribution run may have stopped."
      : "";

  return {
    id,
    label,
    stage: 2,
    level,
    value: formatAge(file.created_at, now),
    detail: `Received ${getDatetime(file.created_at)} (${formatAge(file.created_at, now)} ago), ${file.rows_processed} rows processed.${reason}`,
  };
};

const buildMetadataCheck = (
  metadata: CollectionMetadata | null | undefined,
): HealthCheck => {
  if (!metadata) {
    return {
      id: "metadata",
      label: "Metadata",
      stage: 2,
      level: "fail",
      value: "never",
      detail:
        "No metadata.bcos has been received. It only accompanies a GENERIC (concept) scan, so this failing usually means the concept scan has never completed.",
    };
  }

  return {
    id: "metadata",
    label: "Metadata",
    stage: 2,
    level: "ok",
    value: metadata.bclink || "received",
    detail: `BUNNY ${metadata.bclink || "version unknown"}, data model ${metadata.datamodel || "unknown"}, received ${getDatetime(metadata.created_at)}.`,
  };
};

export const buildRegressionCheck = (
  test: RegressionTest,
  collectionPid: string,
  now: number = Date.now(),
): HealthCheck => {
  const base = {
    id: regressionCheckId(test.pid),
    label: test.name,
    stage: 3 as HealthStage,
    testPid: test.pid,
  };

  const link = test.collections?.find(
    (collection) => collection.pid === collectionPid,
  );

  if (!link) {
    return {
      ...base,
      level: "none",
      value: "—",
      detail: "This collection is not linked to this health check.",
      expected: null,
      linked: false,
    };
  }

  const actual = link.tasks?.[0]?.result?.count;
  const expected = link.expected_result;

  if (link.last_passed === null || link.last_passed === undefined) {
    return {
      ...base,
      level: "none",
      value: "never",
      expected,
      linked: true,
      detail:
        expected === null
          ? "Never run, and no expected result is set — this check can never pass until one is set."
          : `Never run against this collection. Expected ${expected.toLocaleString()}.`,
    };
  }

  return {
    ...base,
    level: link.last_passed ? "ok" : "fail",
    // Matches the other columns: how long ago it last ran, not the count.
    value: formatAge(link.last_run_at, now),
    expected,
    linked: true,
    detail: `Expected ${expected?.toLocaleString() ?? "not set"}, got ${actual?.toLocaleString() ?? "no result"}. Last run ${getDatetime(link.last_run_at ?? undefined)} (${formatAge(link.last_run_at, now)} ago). Passed ${link.pass_rate ?? 0}% of ${link.run_count} run(s).`,
  };
};

const buildOverall = (
  checks: HealthCheck[],
): { level: HealthLevel; label: string } => {
  const pingFailed = checks.some(
    (check) => check.stage === 1 && check.level === "fail",
  );

  if (checks.some((check) => check.level === "fail"))
    return { level: "fail", label: pingFailed ? "Offline" : "Failing" };

  if (checks.some((check) => check.level === "warn"))
    return { level: "warn", label: "Degraded" };

  return { level: "ok", label: "Live" };
};

export const buildCollectionHealth = (
  collection: CollectionWithHosts,
  tests: RegressionTest[],
  now: number = Date.now(),
): CollectionHealthRow => {
  const regressionChecks = tests.map((test) =>
    buildRegressionCheck(test, collection.pid, now),
  );

  const checks: HealthCheck[] = [
    buildPingCheck("ping_a", "A-type ping", collection.last_ping?.a, now),
    buildPingCheck("ping_b", "B-type ping", collection.last_ping?.b, now),
    buildCohortQueryCheck(collection.last_successful_query, now),
    buildScanCheck(
      "concept_scan",
      "Concept scan",
      collection.latest_successful_concept_result_file,
      now,
    ),
    buildScanCheck(
      "demographics_scan",
      "Demographics scan",
      collection.latest_successful_demographic_result_file,
      now,
    ),
    buildMetadataCheck(collection.latest_metadata),
    ...regressionChecks,
  ];

  return {
    pid: collection.pid,
    name: collection.name,
    custodianName: collection.custodian?.name ?? "—",
    isSynthetic: !!collection.is_synthetic,
    stateSlug: collection.model_state?.state?.slug ?? "unknown",
    contextType: collection.type ?? "—",
    url: collection.url ?? null,
    createdAt: getDatetime(collection.created_at),
    bunnyVersion: collection.latest_metadata?.bclink ?? null,
    checks,
    overall: buildOverall(checks),
    regressionTestPids: regressionChecks
      .filter((check) => check.linked)
      .map((check) => check.testPid as string),
  };
};

export const buildHealthRows = (
  collections: CollectionWithHosts[],
  tests: RegressionTest[],
  now: number = Date.now(),
): CollectionHealthRow[] =>
  collections.map((collection) =>
    buildCollectionHealth(collection, tests, now),
  );

export const getCheck = (row: CollectionHealthRow, id: string) =>
  row.checks.find((check) => check.id === id);
