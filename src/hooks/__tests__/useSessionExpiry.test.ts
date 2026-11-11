import { act, renderHook } from "@testing-library/react";
import useSessionExpiry from "../useSessionExpiry";
import { useSessionStore } from "@/store/sessionStore";

const NOW_MS = 1_700_000_000_000;
const NOW_SECONDS = NOW_MS / 1000;

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

  it("ends the session when the cookie expires", () => {
    renderHook(() => useSessionExpiry(NOW_SECONDS + 90));

    act(() => jest.advanceTimersByTime(59_999));
    expect(hasEnded()).toBe(false);

    act(() => jest.advanceTimersByTime(1));
    expect(hasEnded()).toBe(true);
  });

  it("ends the session straight away when it has already expired", () => {
    renderHook(() => useSessionExpiry(NOW_SECONDS - 10));

    act(() => jest.advanceTimersByTime(0));

    expect(hasEnded()).toBe(true);
  });

  it("ends the session when the tab comes back after expiry", () => {
    renderHook(() => useSessionExpiry(NOW_SECONDS + 90 * 24 * 60 * 60));

    jest.setSystemTime(NOW_MS + 91 * 24 * 60 * 60 * 1000);
    act(() => setVisibility("visible"));

    expect(hasEnded()).toBe(true);
  });

  it("leaves the session alone when the tab comes back before expiry", () => {
    renderHook(() => useSessionExpiry(NOW_SECONDS + 90));

    act(() => setVisibility("visible"));

    expect(hasEnded()).toBe(false);
  });

  it("does nothing when the token has no expiry", () => {
    renderHook(() => useSessionExpiry(undefined));

    act(() => jest.runAllTimers());

    expect(hasEnded()).toBe(false);
  });

  it("stops the timer on unmount", () => {
    const { unmount } = renderHook(() => useSessionExpiry(NOW_SECONDS + 90));

    unmount();
    act(() => jest.runAllTimers());

    expect(hasEnded()).toBe(false);
  });
});
