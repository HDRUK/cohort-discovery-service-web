import { ApiError } from "@/lib/https";
import { NotifyFn } from "@/providers/NotifyProvider";
import { useSessionStore } from "@/store/sessionStore";
import {
  handleQuerySubmissionError,
  QUERY_LIMIT_REACHED_MESSAGE,
} from "../queryErrors";

import { useQueryLimitStore } from "@/store/queryLimitStore";

const notify = jest.fn() as unknown as NotifyFn;

const errorWith = (code: number) => ({ code, text: "Nope" });

describe("handleQuerySubmissionError", () => {
  beforeEach(() => {
    useSessionStore.setState({ hasEnded: false });
    useQueryLimitStore.setState({ isQueryLimitReached: false });
  });

  it("ends the session on a 401 without a toast of its own", () => {
    handleQuerySubmissionError(errorWith(401), notify);

    expect(useSessionStore.getState().hasEnded).toBe(true);
    expect(notify).not.toHaveBeenCalled();
  });

  it("marks the query limit reached on a 429", () => {
    handleQuerySubmissionError(errorWith(429), notify);

    expect(useQueryLimitStore.getState().isQueryLimitReached).toBe(true);
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: QUERY_LIMIT_REACHED_MESSAGE }),
    );
    expect(useSessionStore.getState().hasEnded).toBe(false);
  });

  it("rethrows any other error", () => {
    expect(() => handleQuerySubmissionError(errorWith(500), notify)).toThrow(
      ApiError,
    );
  });
});
