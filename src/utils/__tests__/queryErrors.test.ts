import {
  handleQuerySubmissionError,
  QUERY_LIMIT_REACHED_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from "@/utils/queryErrors";
import { useUserDataStore } from "@/hooks/userDataStore";
import { routes } from "@/config/routes";
import { ApiError } from "@/lib/https";
import { hardNavigate } from "@/utils/navigation";
import { DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS } from "@/config/defaults";

jest.mock("@/utils/navigation", () => ({ hardNavigate: jest.fn() }));

describe("handleQuerySubmissionError", () => {
  const notify = jest.fn();

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // An expired token used to throw here inside an async click handler, so
  // the submit silently did nothing. The user must be told and sent to sign
  // in again instead.
  it("tells the user their session expired and sends them to log out on a 401", () => {
    jest.useFakeTimers();
    handleQuerySubmissionError({ code: 401, text: "Unauthorized" }, notify);

    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        message: SESSION_EXPIRED_MESSAGE,
        severity: "error",
      }),
    );
    // Navigating straight away unloads the page before the message can be
    // read, so the redirect must wait.
    jest.advanceTimersByTime(DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS - 1);
    expect(hardNavigate).not.toHaveBeenCalled();

    // The logout route is what clears the expired cookie and redirects to
    // sign-in, so it must be a full navigation to that route.
    jest.advanceTimersByTime(1);
    expect(hardNavigate).toHaveBeenCalledWith(routes.logout);
  });

  it("marks the query limit as reached on a 429 without logging the user out", () => {
    const markQueryLimitReached = jest.fn();
    useUserDataStore.setState({ markQueryLimitReached });

    handleQuerySubmissionError({ code: 429, text: "Too Many" }, notify);

    expect(markQueryLimitReached).toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: QUERY_LIMIT_REACHED_MESSAGE }),
    );
    expect(hardNavigate).not.toHaveBeenCalled();
  });

  it("rethrows other errors so they still surface", () => {
    expect(() =>
      handleQuerySubmissionError({ code: 500, text: "Server error" }, notify),
    ).toThrow(ApiError);
    expect(hardNavigate).not.toHaveBeenCalled();
  });
});
