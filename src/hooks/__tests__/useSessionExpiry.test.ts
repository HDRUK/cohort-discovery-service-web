import { act, renderHook } from "@testing-library/react";
import useSessionExpiry from "../useSessionExpiry";
import { useSessionStore } from "@/store/sessionStore";

const NOW_MS = 1_700_000_000_000;
const A_MINUTE = 60_000;
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

const hasEnded = () => useSessionStore.getState().hasEnded;

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
};

describe("useSessionExpiry", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: NOW_MS });
    useSessionStore.setState({ hasEnded: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("ends the session when the remaining time runs out", () => {
    renderHook(() => useSessionExpiry(A_MINUTE));

    act(() => jest.advanceTimersByTime(A_MINUTE - 1));
    expect(hasEnded()).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(hasEnded()).toBe(true);
  });

  it("ends the session straight away when no time remains", () => {
    renderHook(() => useSessionExpiry(0));

    act(() => jest.advanceTimersByTime(0));

    expect(hasEnded()).toBe(true);
  });

  it("ignores how far the browser clock is from the server's", () => {
    jest.setSystemTime(NOW_MS + 2 * 60 * A_MINUTE);
    renderHook(() => useSessionExpiry(A_MINUTE));

    act(() => setVisibility("visible"));
    act(() => jest.advanceTimersByTime(A_MINUTE - 1));
    expect(hasEnded()).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(hasEnded()).toBe(true);
  });

  it("ends the session when the tab comes back after the deadline", () => {
    renderHook(() => useSessionExpiry(NINETY_DAYS));

    jest.setSystemTime(NOW_MS + NINETY_DAYS);
    act(() => setVisibility("visible"));

    expect(hasEnded()).toBe(true);
  });

  it("leaves the session alone when the tab comes back before the deadline", () => {
    renderHook(() => useSessionExpiry(A_MINUTE));

    act(() => setVisibility("visible"));

    expect(hasEnded()).toBe(false);
  });

  it("does nothing when the remaining time is unknown", () => {
    renderHook(() => useSessionExpiry(null));

    act(() => jest.runAllTimers());

    expect(hasEnded()).toBe(false);
  });

  it("stops the timer on unmount", () => {
    const { unmount } = renderHook(() => useSessionExpiry(A_MINUTE));

    unmount();
    act(() => jest.runAllTimers());

    expect(hasEnded()).toBe(false);
  });
});
