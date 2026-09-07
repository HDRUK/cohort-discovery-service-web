export const DEFAULT_PER_PAGE = 25;
export const DEFAULT_QUERIES_PER_PAGE = 5;
export const DEFAULT_QUERIES_DROPDOWN_PER_PAGE = 5;
export const DEFAULT_CODES_PER_PAGE = 20;
export const DEFAULT_USERS_PER_PAGE = 10;
export const DEFAULT_MAX_VARCHAR_LENGTH = 255;
export const DEFAULT_TRIGGER_GUTTER_PX = 70;
export const DEFAULT_ID_REF_SUFFIX = "hierarchyMenuItem";
export const DEFAULT_REFRESH_TABLE = 1000;
export const DEFAULT_REVALIDATE = 300;
export const DEFAULT_MAX_INVALID_REASONS = 4;
export const DEFAULT_SEARCH_PREFETCH = 500;
export const DEFAULT_SEARCH_WAIT_TIME = 400;
export const DEFAULT_SEARCH_SUGGESTION_ROTATION = 2000;
export const DEFAULT_SEARCH_RESULTS_MAX_HEIGHT = 420;
export const DEFAULT_ACCESS_BANNER_AUTO_HIDE = 30000;

// Collection health ping ages, in milliseconds. BUNNY polls for A-type tasks
// every few seconds, so an A ping older than a minute means something is wrong.
// B-type polling is far less frequent and gets an order of magnitude more slack.
export const DEFAULT_PING_A_WARN_MS = 60 * 1000;
export const DEFAULT_PING_A_FAIL_MS = 10 * 60 * 1000;
export const DEFAULT_PING_B_WARN_MS = 10 * 60 * 1000;
export const DEFAULT_PING_B_FAIL_MS = 60 * 60 * 1000;

export const DEFAULT_STATUS_LABELS: Record<string, string> = {
  ok: "Successful",
  error: "Failed",
  pending: "Pending",
};
