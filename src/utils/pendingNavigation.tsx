import { Suspense, use, useEffect, useState } from "react";

export const createPendingNavigation = () => {
  let startNavigation = () => {};
  let finishNavigation = () => {};

  const Router = () => {
    const [navigation, setNavigation] = useState<Promise<void>>();
    useEffect(() => {
      startNavigation = () =>
        setNavigation(
          new Promise<void>((resolve) => {
            finishNavigation = resolve;
          }),
        );
    }, []);
    if (navigation) use(navigation);
    return null;
  };

  const PendingRouter = () => (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );

  return {
    PendingRouter,
    start: () => startNavigation(),
    finish: () => finishNavigation(),
  };
};
