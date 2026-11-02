import { useEffect, useState } from "react";

interface Settled<T> {
  promise: Promise<T>;
  value?: T;
  error?: unknown;
}

interface LatestPromise<T> {
  value: T | undefined;
  isPending: boolean;
}

export const useLatestPromise = <T>(promise: Promise<T>): LatestPromise<T> => {
  const [settled, setSettled] = useState<Settled<T>>();

  useEffect(() => {
    let isLatest = true;

    promise.then(
      (value) => isLatest && setSettled({ promise, value }),
      (error) => isLatest && setSettled({ promise, error }),
    );

    return () => {
      isLatest = false;
    };
  }, [promise]);

  const isPending = settled?.promise !== promise;

  if (!isPending && settled?.error !== undefined) throw settled.error;

  return { value: settled?.value, isPending };
};
